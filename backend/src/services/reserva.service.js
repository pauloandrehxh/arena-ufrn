import {
    ReservaValidationError,
    ReservaNotFoundError,
    ReservaConflictError,
    inicioReservaNoFuturo,
    normalizarDataReserva,
    validarIdReserva,
    validarHorariosReserva,
    validarDataFuturaReserva,
} from '../lib/reserva.validation.js';

const STATUS_ATIVA = 'ATIVA';
const STATUS_CANCELADA = 'CANCELADA';
const ERRO_REGISTRO_NAO_ENCONTRADO = 'P2025';

const CAMPOS_PERMITIDOS = new Set([
    'usuarioId',
    'quadraId',
    'date',
    'startTime',
    'endTime',
]);

const INCLUDE_RESERVA = {
    usuario: true,
    quadra: true,
};

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

    async function listarReservas() {
        return prisma.reserva.findMany({
            include: INCLUDE_RESERVA,
        });
    }

    async function buscarReservaPorId(id) {
        return prisma.reserva.findUnique({
            where: { id },
            include: INCLUDE_RESERVA,
        });
    }

    async function buscarReservasPorUsuario(usuarioId) {
        return prisma.reserva.findMany({
            where: { usuarioId },
            include: {
                quadra: true,
            },
        });
    }

    async function buscarReservasPorQuadra(quadraId) {
        return prisma.reserva.findMany({
            where: { quadraId },
            include: {
                usuario: true,
            },
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
            await validarUsuario(dados.usuarioId, banco);
            await validarQuadra(dados.quadraId, banco);
            await verificarConflito(dados, banco);

            return banco.reserva.create({
                data: dados,
                include: INCLUDE_RESERVA,
            });
        });
    }

    async function atualizarReserva(id, data) {
        validarIdReserva(id, 'ID da reserva');

        const campos = Object.keys(data);

        if (campos.some((campo) => !CAMPOS_PERMITIDOS.has(campo))) {
            throw new ReservaValidationError(
                'Somente usuário, quadra, data e horários podem ser atualizados. Use a operação de cancelamento para alterar o estado.'
            );
        }

        const reservaAtual = await prisma.reserva.findUnique({
            where: { id },
        });

        validarReservaAtiva(reservaAtual, agora);

        const dadosAtualizados = {
            ...reservaAtual,
            ...data,
        };

        if (data.usuarioId !== undefined) {
            validarIdReserva(data.usuarioId, 'usuarioId');
            await validarUsuario(data.usuarioId, prisma);
        }

        if (data.quadraId !== undefined) {
            validarIdReserva(data.quadraId, 'quadraId');
            await validarQuadra(data.quadraId, prisma);
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

        await verificarConflito(dadosAtualizados, prisma, id);

        try {
            return await prisma.reserva.update({
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
    }

    async function cancelarReserva(id) {
        validarIdReserva(id, 'ID da reserva');

        return prisma.$transaction(async (banco) => {
            const reserva = await banco.reserva.findUnique({
                where: { id },
                include: INCLUDE_RESERVA,
            });

            if (!reserva) {
                throw new ReservaNotFoundError();
            }

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
