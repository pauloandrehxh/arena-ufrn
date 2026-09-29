import { Router } from 'express';

export function createReservaRoutes(reservaController) {
    const router = Router();

    router.get('/', reservaController.listar);

    router.get('/:id', reservaController.buscarPorId);

    router.get('/usuario/:usuarioId', reservaController.listarPorUsuario);

    router.get('/quadra/:quadraId', reservaController.listarPorQuadra);

    router.post('/', reservaController.criar);

    router.put('/:id', reservaController.atualizar);

    router.delete('/:id', reservaController.deletar);

    return router;
}