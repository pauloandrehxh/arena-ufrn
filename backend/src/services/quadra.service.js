import { validarIdQuadra, validarNomeQuadra } from '../lib/quadra.validation.js';

export function createQuadraService(prisma) {
    async function listarQuadras() {
        return prisma.quadra.findMany();
    }

    async function buscarQuadraPorId(id) {
        validarIdQuadra(id);
        return prisma.quadra.findUnique({
            where: {
                id
            }
        });
    }

    async function criarQuadra(name) {
        validarNomeQuadra(name);
        return prisma.quadra.create({
            data: {
                name
            }
        });
    }

    async function atualizarQuadra(id, name) {
        validarIdQuadra(id);
        validarNomeQuadra(name);
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
        validarIdQuadra(id);
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
