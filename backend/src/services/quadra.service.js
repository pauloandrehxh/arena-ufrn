import {
    QuadraConflictError,
    QuadraNotFoundError,
    validarIdQuadra,
    validarNomeQuadra,
    validarStatusAtivo,
    validarTextoOpcional,
} from '../lib/quadra.validation.js';

function tratarErroPrismaQuadra(error) {
    if (error?.code === 'P2025') {
        throw new QuadraNotFoundError();
    }
    if (error?.code === 'P2003') {
        throw new QuadraConflictError(
            'Não é possível excluir uma quadra com reservas vinculadas. Inative-a para manutenção.'
        );
    }
    throw error;
}

export function createQuadraService(prisma) {
    async function listarQuadras() {
        return prisma.quadra.findMany({
            orderBy: { id: 'asc' },
        });
    }

    async function buscarQuadraPorId(id) {
        validarIdQuadra(id);
        return prisma.quadra.findUnique({
            where: { id },
        });
    }

    async function criarQuadra(entrada) {
        const ehObjeto = entrada !== null && typeof entrada === 'object' && !Array.isArray(entrada);
        const name = ehObjeto ? entrada.name : entrada;
        const sport = ehObjeto ? entrada.sport : undefined;
        const description = ehObjeto ? entrada.description : undefined;
        const active = ehObjeto ? entrada.active : undefined;

        validarNomeQuadra(name);
        validarTextoOpcional(sport, 'Modalidade');
        validarTextoOpcional(description, 'Descrição');
        if (active !== undefined) {
            validarStatusAtivo(active);
        }

        const data = { name: name.trim() };
        if (sport !== undefined) data.sport = sport.trim();
        if (description !== undefined) data.description = description.trim();
        if (active !== undefined) data.active = active;

        return prisma.quadra.create({ data });
    }

    async function atualizarQuadra(id, entrada) {
        validarIdQuadra(id);

        const ehObjeto = entrada !== null && typeof entrada === 'object' && !Array.isArray(entrada);
        const name = ehObjeto ? entrada.name : entrada;
        const sport = ehObjeto ? entrada.sport : undefined;
        const description = ehObjeto ? entrada.description : undefined;
        const active = ehObjeto ? entrada.active : undefined;

        validarNomeQuadra(name);
        validarTextoOpcional(sport, 'Modalidade');
        validarTextoOpcional(description, 'Descrição');
        if (active !== undefined) {
            validarStatusAtivo(active);
        }

        const data = { name: name.trim() };
        if (sport !== undefined) data.sport = sport.trim();
        if (description !== undefined) data.description = description.trim();
        if (active !== undefined) data.active = active;

        try {
            return await prisma.quadra.update({
                where: { id },
                data,
            });
        } catch (error) {
            tratarErroPrismaQuadra(error);
        }
    }

    async function alterarStatusQuadra(id, active) {
        validarIdQuadra(id);
        validarStatusAtivo(active);

        try {
            return await prisma.quadra.update({
                where: { id },
                data: { active },
            });
        } catch (error) {
            tratarErroPrismaQuadra(error);
        }
    }

    async function deletarQuadra(id) {
        validarIdQuadra(id);

        if (prisma.reserva?.count) {
            const totalReservas = await prisma.reserva.count({
                where: { quadraId: id },
            });
            if (totalReservas > 0) {
                throw new QuadraConflictError(
                    'Não é possível excluir uma quadra com reservas vinculadas. Inative-a para manutenção.'
                );
            }
        }

        try {
            return await prisma.quadra.delete({
                where: { id },
            });
        } catch (error) {
            tratarErroPrismaQuadra(error);
        }
    }

    return {
        listarQuadras,
        buscarQuadraPorId,
        criarQuadra,
        atualizarQuadra,
        alterarStatusQuadra,
        deletarQuadra,
    };
}
