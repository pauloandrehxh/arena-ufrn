import { Router } from 'express';

export function createQuadraRoutes(quadraController) {
    const router = Router();

    router.get('/', quadraController.listar);

    router.get('/:id', quadraController.buscarPorId);

    router.post('/', quadraController.criar);

    router.put('/:id', quadraController.atualizar);

    router.delete('/:id', quadraController.deletar);

    return router;
}