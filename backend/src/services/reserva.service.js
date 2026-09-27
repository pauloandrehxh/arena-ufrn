export function createReservaService(prisma) {
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
        return prisma.reserva.create({
            data,
            include: {
                usuario: true,
                quadra: true,
            },
        });
    }

    async function atualizarReserva(id, data) {
        return prisma.reserva.update({
            where: { id },
            data,
            include: {
                usuario: true,
                quadra: true,
            },
        });
    }

    async function deletarReserva(id) {
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