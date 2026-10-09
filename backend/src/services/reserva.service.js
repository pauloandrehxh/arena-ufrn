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

export function createReservaService(prisma, { agora = () => new Date() } = {}) {
    async function validarUsuario(usuarioId, banco = prisma) {
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

    async function validarQuadra(quadraId, banco = prisma) {
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

    async function verificarConflito(data, banco = prisma) {
        const conflito = await banco.reserva.findFirst({
            where: {
                quadraId: data.quadraId,
                date: data.date,
                status: 'ATIVA',
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

    async function listarReservas() {
        return prisma.reserva.findMany({
            include: {
                usuario: true,
                quadra: true,
            },
        });
    }

    async function buscarReservaPorId(id) {
        return prisma.reserva.findUnique({
            where: { id },
            include: {
                usuario: true,
                quadra: true,
            },
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
            status: 'ATIVA',
        };

        return prisma.$transaction(async (banco) => {
            await validarUsuario(dados.usuarioId, banco);
            await validarQuadra(dados.quadraId, banco);
            await verificarConflito(dados, banco);

            return banco.reserva.create({
                data: dados,
                include: {
                    usuario: true,
                    quadra: true,
                },
            });
        });
    }

    async function atualizarReserva(id, data) {
        validarIdReserva(id, 'ID da reserva');
        const camposPermitidos = ['usuarioId', 'quadraId', 'date', 'startTime', 'endTime'];
        if (Object.keys(data).some((campo) => !camposPermitidos.includes(campo))) {
            throw new ReservaValidationError('Somente usuário, quadra, data e horários podem ser atualizados. Use a operação de cancelamento para alterar o estado.');
        }

        const reservaAtual = await prisma.reserva.findUnique({
            where: { id },
        });

        if (!reservaAtual) {
            throw new ReservaNotFoundError();
        }

        if (reservaAtual.status !== 'ATIVA') {
            throw new ReservaConflictError('Somente reservas ATIVA podem ser atualizadas.');
        }
        if (!inicioReservaNoFuturo(reservaAtual.date, reservaAtual.startTime, agora())) {
            throw new ReservaConflictError('Não é possível atualizar uma reserva já iniciada.');
        }

        const dadosAtualizados = {
            ...reservaAtual,
            ...data,
        };

        if (data.usuarioId !== undefined) {
            validarIdReserva(data.usuarioId, 'usuarioId');
            await validarUsuario(data.usuarioId);
        }

        if (data.quadraId !== undefined) {
            validarIdReserva(data.quadraId, 'quadraId');
            await validarQuadra(data.quadraId);
        }

        dadosAtualizados.date = normalizarDataReserva(dadosAtualizados.date);
        validarHorariosReserva(
            dadosAtualizados.startTime,
            dadosAtualizados.endTime
        );
        validarDataFuturaReserva(dadosAtualizados.date, dadosAtualizados.startTime, agora());

        const conflito = await prisma.reserva.findFirst({
            where: {
                id: {
                    not: id,
                },
                quadraId: dadosAtualizados.quadraId,
                date: dadosAtualizados.date,
                status: 'ATIVA',
                startTime: {
                    lt: dadosAtualizados.endTime,
                },
                endTime: {
                    gt: dadosAtualizados.startTime,
                },
            },
        });

        if (conflito) {
            throw new Error(
                'Já existe uma reserva para essa quadra nesse horário.'
            );
        }

        try {
            return await prisma.reserva.update({
                where: { id, status: 'ATIVA' },
                data: {
                    ...data,
                    ...(data.date === undefined ? {} : { date: dadosAtualizados.date }),
                },
                include: {
                    usuario: true,
                    quadra: true,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new ReservaConflictError('A reserva foi alterada durante a atualização.');
            }
            throw error;
        }
    }

    async function cancelarReserva(id) {
        validarIdReserva(id, 'ID da reserva');

        return prisma.$transaction(async (banco) => {
            const reserva = await banco.reserva.findUnique({
                where: { id },
                include: { usuario: true, quadra: true },
            });

            if (!reserva) {
                throw new ReservaNotFoundError();
            }
            if (reserva.status === 'CANCELADA') {
                return reserva;
            }
            if (reserva.status !== 'ATIVA') {
                throw new ReservaConflictError('Somente reservas ATIVA podem ser canceladas.');
            }
            if (!inicioReservaNoFuturo(reserva.date, reserva.startTime, agora())) {
                throw new ReservaConflictError('Não é possível cancelar uma reserva já iniciada.');
            }

            try {
                return await banco.reserva.update({
                    where: {
                        id, status: 'ATIVA', date: reserva.date, startTime: reserva.startTime,
                    },
                    data: { status: 'CANCELADA' },
                    include: { usuario: true, quadra: true },
                });
            } catch (error) {
                if (error.code === 'P2025') {
                    throw new ReservaConflictError('A reserva foi alterada durante o cancelamento.');
                }
                throw error;
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
        deletarReserva: cancelarReserva
    };
}
