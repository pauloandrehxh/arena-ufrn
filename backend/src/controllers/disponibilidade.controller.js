
export function createDisponibilidadeController(service) {
    async function consultar(req, res) {
        try {
            const resultado = await service.consultar({
                quadraId: req.query.quadraId,
                date: req.query.date,
            });

            return res.status(200).json(resultado);
        } catch (error) {
            const status = error.status ?? 400;

            return res.status(status).json({
                erro: error.message || 'Erro ao consultar disponibilidade.',
            });
        }
    }

    return { consultar };
}
