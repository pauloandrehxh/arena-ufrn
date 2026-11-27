import { Router } from 'express';

const passthrough = (req, res, next) => next();

export function createQuadraRoutes(quadraController, authMiddlewares = null) {
    const router = Router();
    const requireAuth = authMiddlewares?.requireAuth ?? passthrough;
    const requireGestor = authMiddlewares?.requireRole
        ? authMiddlewares.requireRole('GESTOR')
        : passthrough;

    router.get('/', quadraController.listar);

    router.get('/:id', quadraController.buscarPorId);

    router.post('/', requireAuth, requireGestor, quadraController.criar);

    router.put('/:id', requireAuth, requireGestor, quadraController.atualizar);

    router.patch('/:id/status', requireAuth, requireGestor, quadraController.alterarStatus);

    router.delete('/:id', requireAuth, requireGestor, quadraController.deletar);

    return router;
}
