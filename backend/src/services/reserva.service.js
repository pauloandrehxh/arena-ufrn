function validarHorarios(startTime, endTime) {
    if (!startTime || !endTime) {
        throw new Error('Horário inicial e final são obrigatórios.');
    }

    if (startTime >= endTime) {
        throw new Error(
            'O horário inicial deve ser anterior ao horário final.'
        );
    }
}

function validarData(date) {
    const dataReserva = new Date(date);
    const dataAtual = new Date();

    dataReserva.setHours(0, 0, 0, 0);
    dataAtual.setHours(0, 0, 0, 0);

    if (dataReserva < dataAtual) {
        throw new Error('Não é possível criar uma reserva no passado.');
    }
}

export function createReservaService(prisma) {
    async function validarUsuario(usuarioId) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }

        if (!usuario.active) {
            throw new Error('Usuário inativo.');
        }

        return usuario;
    }

    async function validarQuadra(quadraId) {
        const quadra = await prisma.quadra.findUnique({
            where: { id: quadraId },
        });

        if (!quadra) {
            throw new Error('Quadra não encontrada.');
        }

        if (!quadra.active) {
            throw new Error('Quadra indisponível.');
        }

        return quadra;
    }

    async function verificarConflito(data) {
        const conflito = await prisma.reserva.findFirst({
            where: {
                quadraId: data.quadraId,
                date: data.date,
                startTime: {
                    lt: data.endTime,
                },
                endTime: {
                    gt: data.startTime,
                },
            },
        });

        if (conflito) {
            throw new Error(
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
        await validarUsuario(data.usuarioId);
        await validarQuadra(data.quadraId);

        validarData(data.date);
        validarHorarios(data.startTime, data.endTime);

        await verificarConflito(data);

        return prisma.reserva.create({
            data,
            include: {
                usuario: true,
                quadra: true,
            },
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

        validarData(dadosAtualizados.date);
        validarHorarios(
            dadosAtualizados.startTime,
            dadosAtualizados.endTime
        );

        const conflito = await prisma.reserva.findFirst({
            where: {
                id: {
                    not: id,
                },
                quadraId: dadosAtualizados.quadraId,
                date: dadosAtualizados.date,
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
            data,
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