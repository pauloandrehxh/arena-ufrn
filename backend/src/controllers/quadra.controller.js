export function createQuadraController(quadraService) {
    async function listar(req, res) {
        try {
            const quadras = await quadraService.listarQuadras();

            return res.json(quadras);
        } catch (error) {
            console.error('Erro ao buscar quadras:', error);

            return res.status(500).json({
                message: 'Erro ao buscar quadras.'
            });
        }
    }

    async function buscarPorId(req, res) {
        try {
            const id = Number(req.params.id);

            const quadra = await quadraService.buscarQuadraPorId(id);

            if (!quadra) {
                return res.status(404).json({
                    message: 'Quadra não encontrada.'
                });
            }

            return res.json(quadra);
        } catch (error) {
            console.error('Erro ao buscar quadra:', error);

            return res.status(500).json({
                message: 'Erro ao buscar a quadra.'
            });
        }
    }

    async function criar(req, res) {
        try {
            const { name } = req.body;

            const quadra = await quadraService.criarQuadra(name);

            return res.status(201).json(quadra);
        } catch (error) {
            console.error('Erro ao criar quadra:', error);

            return res.status(500).json({
                message: 'Erro ao criar quadra.'
            });
        }
    }

    async function atualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;

            const quadra = await quadraService.atualizarQuadra(
                id,
                name
            );

            return res.json(quadra);
        } catch (error) {
            console.error('Erro ao atualizar quadra:', error);

            return res.status(500).json({
                message: 'Erro ao atualizar quadra.'
            });
        }
    }

    async function deletar(req, res) {
        try {
            const id = Number(req.params.id);

            await quadraService.deletarQuadra(id);

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar quadra:', error);

            return res.status(500).json({
                message: 'Erro ao deletar quadra.'
            });
        }
    }

    return {
        listar,
        buscarPorId,
        criar,
        atualizar,
        deletar
    };
}