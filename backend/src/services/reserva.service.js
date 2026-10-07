import {
    ReservaValidationError,
    normalizarDataReserva,
    validarIdReserva,
    validarHorariosReserva,
    validarDataFuturaReserva,
} from '../lib/reserva.validation.js';

export function createReservaService(prisma) {
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
        validarDataFuturaReserva(date, data.startTime);

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
        const reservaAtual = await prisma.reserva.findUnique({
            where: { id },
        });

        if (!reservaAtual) {
            throw new Error('Reserva não encontrada.');
        }

        const dadosAtualizados = {
            ...reservaAtual,
            ...data,
        };

        if (data.usuarioId) {
            await validarUsuario(data.usuarioId);
        }

        if (data.quadraId) {
            await validarQuadra(data.quadraId);
        }

        dadosAtualizados.date = normalizarDataReserva(dadosAtualizados.date);
        validarHorariosReserva(
            dadosAtualizados.startTime,
            dadosAtualizados.endTime
        );
        validarDataFuturaReserva(dadosAtualizados.date, dadosAtualizados.startTime);

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

        return prisma.reserva.update({
            where: { id },
            data: {
                ...data,
                ...(data.date === undefined ? {} : { date: dadosAtualizados.date }),
            },
            include: {
                usuario: true,
                quadra: true,
            },
        });
    }

    async function deletarReserva(id) {
        const reserva = await prisma.reserva.findUnique({
            where: { id },
        });

        if (!reserva) {
            throw new Error('Reserva não encontrada.');
        }

        return prisma.reserva.delete({
            where: { id },
        });
    }

    return {
        listarReservas,
        buscarReservaPorId,
        buscarReservasPorUsuario,
        buscarReservasPorQuadra,
        criarReserva,
        atualizarReserva,
        deletarReserva
    };
}
