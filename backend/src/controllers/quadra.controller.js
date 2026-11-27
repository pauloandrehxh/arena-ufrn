import {
    QuadraConflictError,
    QuadraNotFoundError,
    QuadraValidationError,
} from '../lib/quadra.validation.js';

function responderErro(res, error, mensagem) {
    if (error instanceof QuadraValidationError) {
        return res.status(400).json({ message: error.message });
    }
    if (error instanceof QuadraNotFoundError) {
        return res.status(404).json({ message: error.message });
    }
    if (error instanceof QuadraConflictError) {
        return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: mensagem });
}

export function createQuadraController(quadraService) {
    async function listar(req, res) {
        try {
            const quadras = await quadraService.listarQuadras();

            return res.json(quadras);
        } catch (error) {
            return responderErro(res, error, 'Erro ao buscar quadras.');
        }
    }

    async function buscarPorId(req, res) {
        try {
            const id = Number(req.params.id);

            const quadra = await quadraService.buscarQuadraPorId(id);

            if (!quadra) {
                return res.status(404).json({
                    message: 'Quadra não encontrada.',
                });
            }

            return res.json(quadra);
        } catch (error) {
            return responderErro(res, error, 'Erro ao buscar a quadra.');
        }
    }

    async function criar(req, res) {
        try {
            const { name, sport, description, active } = req.body ?? {};
            const temExtras = sport !== undefined || description !== undefined || active !== undefined;

            const quadra = await quadraService.criarQuadra(
                temExtras ? { name, sport, description, active } : name
            );

            return res.status(201).json(quadra);
        } catch (error) {
            return responderErro(res, error, 'Erro ao criar quadra.');
        }
    }

    async function atualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const { name, sport, description, active } = req.body ?? {};
            const temExtras = sport !== undefined || description !== undefined || active !== undefined;

            const quadra = await quadraService.atualizarQuadra(
                id,
                temExtras ? { name, sport, description, active } : name
            );

            return res.json(quadra);
        } catch (error) {
            return responderErro(res, error, 'Erro ao atualizar quadra.');
        }
    }

    async function alterarStatus(req, res) {
        try {
            const id = Number(req.params.id);
            const { active } = req.body ?? {};

            const quadra = await quadraService.alterarStatusQuadra(id, active);

            return res.json(quadra);
        } catch (error) {
            return responderErro(res, error, 'Erro ao alterar status da quadra.');
        }
    }

    async function deletar(req, res) {
        try {
            const id = Number(req.params.id);

            await quadraService.deletarQuadra(id);

            return res.status(204).send();
        } catch (error) {
            return responderErro(res, error, 'Erro ao deletar quadra.');
        }
    }

    return {
        listar,
        buscarPorId,
        criar,
        atualizar,
        alterarStatus,
        deletar,
    };
}
