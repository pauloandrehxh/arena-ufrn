export function createQuadraService(prisma) {
    async function listarQuadras() {
        return prisma.quadra.findMany();
    }

    async function buscarQuadraPorId(id) {
        return prisma.quadra.findUnique({
            where: {
                id
            }
        });
    }

    async function criarQuadra(name) {
        return prisma.quadra.create({
            data: {
                name
            }
        });
    }

    async function atualizarQuadra(id, name) {
        return prisma.quadra.update({
            where: {
                id
            },
            data: {
                name
            }
        });
    }

    async function deletarQuadra(id) {
        return prisma.quadra.delete({
            where: {
                id
            }
        });
    }

    return {
        listarQuadras,
        buscarQuadraPorId,
        criarQuadra,
        atualizarQuadra,
        deletarQuadra
    };
}