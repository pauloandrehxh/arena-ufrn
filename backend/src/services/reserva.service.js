import {
    ReservaValidationError,
    ReservaNotFoundError,
    ReservaConflictError,
    ReservaForbiddenError,
    inicioReservaNoFuturo,
    normalizarDataReserva,
    validarIdReserva,
    validarHorariosReserva,
    validarDataFuturaReserva,
} from '../lib/reserva.validation.js';
import { USUARIO_PUBLICO_SELECT } from '../lib/usuario.select.js';

const STATUS_ATIVA = 'ATIVA';
const STATUS_CANCELADA = 'CANCELADA';
const STATUS_VALIDOS = new Set(['ATIVA', 'CANCELADA', 'CONCLUIDA']);
const ERRO_REGISTRO_NAO_ENCONTRADO = 'P2025';

const CAMPOS_PERMITIDOS = new Set([
    'usuarioId',
    'quadraId',
    'date',
    'startTime',
    'endTime',
]);

const INCLUDE_RESERVA = {
    usuario: { select: USUARIO_PUBLICO_SELECT },
    quadra: true,
};

async function travarQuadraNaTransacao(banco, quadraId) {
    if (typeof banco.$executeRaw === 'function') {
        await banco.$executeRaw`SELECT pg_advisory_xact_lock(${Number(quadraId)})`;
    }
}

function construirFiltroReservas(filtros = {}) {
    const where = {};

    if (filtros.usuarioId !== undefined) {
        where.usuarioId = filtros.usuarioId;
    }

    if (filtros.quadraId !== undefined && filtros.quadraId !== '') {
        const quadraId = Number(filtros.quadraId);
        validarIdReserva(quadraId, 'quadraId');
        where.quadraId = quadraId;
    }

    if (filtros.status !== undefined && filtros.status !== '') {
        if (!STATUS_VALIDOS.has(filtros.status)) {
            throw new ReservaValidationError('Status de filtro inválido. Use ATIVA, CANCELADA ou CONCLUIDA.');
        }
        where.status = filtros.status;
    }

    if (filtros.dateFrom || filtros.dateTo) {
        where.date = {};
        if (filtros.dateFrom) {
            where.date.gte = normalizarDataReserva(filtros.dateFrom);
        }
        if (filtros.dateTo) {
            where.date.lte = normalizarDataReserva(filtros.dateTo);
        }
    }

    return where;
}

async function validarUsuario(usuarioId, banco) {
    const usuario = await banco.usuario.findUnique({
        where: { id: usuarioId },
    });

    if (!usuario) {
        throw new ReservaValidationError('Usuário não encontrado.');
    }

    if (!usuario.active) {
        throw new ReservaValidationError('Usuário inativo.');
    }

    return usuario;
}

async function validarQuadra(quadraId, banco) {
    const quadra = await banco.quadra.findUnique({
        where: { id: quadraId },
    });

    if (!quadra) {
        throw new ReservaValidationError('Quadra não encontrada.');
    }

    if (!quadra.active) {
        throw new ReservaValidationError('Quadra indisponível.');
    }

    return quadra;
}

async function verificarConflito(data, banco, id = null) {
    const conflito = await banco.reserva.findFirst({
        where: {
            ...(id ? { id: { not: id } } : {}),
            quadraId: data.quadraId,
            date: data.date,
            status: STATUS_ATIVA,
            startTime: {
                lt: data.endTime,
            },
            endTime: {
                gt: data.startTime,
            },
        },
    });

    if (conflito) {
        throw new ReservaValidationError(
            'Já existe uma reserva para essa quadra nesse horário.'
        );
    }
}

function verificarErroPrisma(error, mensagem) {
    if (error.code === ERRO_REGISTRO_NAO_ENCONTRADO) {
        throw new ReservaConflictError(mensagem);
    }

    throw error;
}

function validarPermissaoReserva(reserva, ator) {
    if (!ator) return;
    if (ator.role !== 'GESTOR' && reserva.usuarioId !== ator.id) {
        throw new ReservaForbiddenError();
    }
}

function validarReservaAtiva(reserva, agora) {
    if (!reserva) {
        throw new ReservaNotFoundError();
    }

    if (reserva.status !== STATUS_ATIVA) {
        throw new ReservaConflictError(
            'Somente reservas ATIVA podem ser atualizadas.'
        );
    }

    if (!inicioReservaNoFuturo(reserva.date, reserva.startTime, agora())) {
        throw new ReservaConflictError(
            'Não é possível atualizar uma reserva já iniciada.'
        );
    }
}

export function createReservaService(prisma, { agora = () => new Date() } = {}) {

    async function listarReservas(filtros = {}) {
        const where = construirFiltroReservas(filtros);
        const temFiltros = Object.keys(where).length > 0;

        return prisma.reserva.findMany({
            ...(temFiltros ? { where } : {}),
            include: INCLUDE_RESERVA,
            orderBy: [
                { date: 'desc' },
                { startTime: 'asc' },
            ],
        });
    }

    async function buscarReservaPorId(id) {
        return prisma.reserva.findUnique({
            where: { id },
            include: INCLUDE_RESERVA,
        });
    }

    async function buscarReservasPorUsuario(usuarioId, filtros = {}) {
        const where = construirFiltroReservas({ ...filtros, usuarioId });

        return prisma.reserva.findMany({
            where,
            include: {
                quadra: true,
            },
            orderBy: [
                { date: 'desc' },
                { startTime: 'asc' },
            ],
        });
    }

    async function buscarReservasPorQuadra(quadraId) {
        return prisma.reserva.findMany({
            where: { quadraId },
            include: {
                usuario: { select: USUARIO_PUBLICO_SELECT },
            },
            orderBy: [
                { date: 'desc' },
                { startTime: 'asc' },
            ],
        });
    }

    async function criarReserva(data) {
        validarIdReserva(data.usuarioId, 'usuarioId');
        validarIdReserva(data.quadraId, 'quadraId');

        const date = normalizarDataReserva(data.date);

        validarHorariosReserva(data.startTime, data.endTime);
        validarDataFuturaReserva(date, data.startTime, agora());

        const dados = {
            usuarioId: data.usuarioId,
            quadraId: data.quadraId,
            date,
            startTime: data.startTime,
            endTime: data.endTime,
            status: STATUS_ATIVA,
        };

        return prisma.$transaction(async (banco) => {
            await travarQuadraNaTransacao(banco, dados.quadraId);
            await validarUsuario(dados.usuarioId, banco);
            await validarQuadra(dados.quadraId, banco);
            await verificarConflito(dados, banco);

            return banco.reserva.create({
                data: dados,
                include: INCLUDE_RESERVA,
            });
        });
    }

    async function atualizarReserva(id, data, ator = null) {
        validarIdReserva(id, 'ID da reserva');

        const campos = Object.keys(data);

        if (campos.some((campo) => !CAMPOS_PERMITIDOS.has(campo))) {
            throw new ReservaValidationError(
                'Somente usuário, quadra, data e horários podem ser atualizados. Use a operação de cancelamento para alterar o estado.'
            );
        }

        if (ator && ator.role !== 'GESTOR' && data.usuarioId !== undefined && data.usuarioId !== ator.id) {
            throw new ReservaForbiddenError('Não é permitido transferir a reserva para outro usuário.');
        }

        const executar = async (banco) => {
            const reservaAtual = await banco.reserva.findUnique({
                where: { id },
            });

            if (!reservaAtual) {
                throw new ReservaNotFoundError();
            }

            validarPermissaoReserva(reservaAtual, ator);
            validarReservaAtiva(reservaAtual, agora);

            const dadosAtualizados = {
                ...reservaAtual,
                ...data,
            };

            const quadraAlvo = data.quadraId !== undefined ? data.quadraId : reservaAtual.quadraId;
            if (data.quadraId !== undefined) {
                validarIdReserva(data.quadraId, 'quadraId');
            }
            await travarQuadraNaTransacao(banco, quadraAlvo);

            if (data.usuarioId !== undefined) {
                validarIdReserva(data.usuarioId, 'usuarioId');
                await validarUsuario(data.usuarioId, banco);
            }

            if (data.quadraId !== undefined) {
                await validarQuadra(data.quadraId, banco);
            }

            dadosAtualizados.date = normalizarDataReserva(
                dadosAtualizados.date
            );

            validarHorariosReserva(
                dadosAtualizados.startTime,
                dadosAtualizados.endTime
            );

            validarDataFuturaReserva(
                dadosAtualizados.date,
                dadosAtualizados.startTime,
                agora()
            );

            await verificarConflito(dadosAtualizados, banco, id);

            try {
                return await banco.reserva.update({
                    where: {
                        id,
                        status: STATUS_ATIVA,
                    },
                    data: {
                        ...data,
                        date: dadosAtualizados.date,
                    },
                    include: INCLUDE_RESERVA,
                });
            } catch (error) {
                verificarErroPrisma(
                    error,
                    'A reserva foi alterada durante a atualização.'
                );
            }
        };

        if (typeof prisma.$transaction === 'function') {
            return prisma.$transaction(executar);
        }
        return executar(prisma);
    }

    async function cancelarReserva(id, ator = null) {
        validarIdReserva(id, 'ID da reserva');

        return prisma.$transaction(async (banco) => {
            const reserva = await banco.reserva.findUnique({
                where: { id },
                include: INCLUDE_RESERVA,
            });

            if (!reserva) {
                throw new ReservaNotFoundError();
            }

            validarPermissaoReserva(reserva, ator);

            if (reserva.status === STATUS_CANCELADA) {
                return reserva;
            }

            if (reserva.status !== STATUS_ATIVA) {
                throw new ReservaConflictError(
                    'Somente reservas ATIVA podem ser canceladas.'
                );
            }

            if (!inicioReservaNoFuturo(reserva.date, reserva.startTime, agora())) {
                throw new ReservaConflictError(
                    'Não é possível cancelar uma reserva já iniciada.'
                );
            }

            if (typeof banco.$executeRaw === 'function') {
                await travarQuadraNaTransacao(banco, reserva.quadraId);
                const reservaAtualizada = await banco.reserva.findUnique({
                    where: { id },
                    include: INCLUDE_RESERVA,
                });
                if (reservaAtualizada?.status === STATUS_CANCELADA) {
                    return reservaAtualizada;
                }
            }

            try {
                return await banco.reserva.update({
                    where: {
                        id,
                        status: STATUS_ATIVA,
                        date: reserva.date,
                        startTime: reserva.startTime,
                    },
                    data: {
                        status: STATUS_CANCELADA,
                    },
                    include: INCLUDE_RESERVA,
                });
            } catch (error) {
                verificarErroPrisma(
                    error,
                    'A reserva foi alterada durante o cancelamento.'
                );
            }
        });
    }

    return {
        listarReservas,
        buscarReservaPorId,
        buscarReservasPorUsuario,
        buscarReservasPorQuadra,
        criarReserva,
        atualizarReserva,
        cancelarReserva,
        deletarReserva: cancelarReserva,
    };
}
