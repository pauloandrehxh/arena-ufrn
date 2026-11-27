import { Router } from 'express';

const passthrough = (req, res, next) => next();

export function createReservaRoutes(reservaController, authMiddlewares = null) {
    const router = Router();
    const requireAuth = authMiddlewares?.requireAuth ?? passthrough;
    const requireGestor = authMiddlewares?.requireRole
        ? authMiddlewares.requireRole('GESTOR')
        : passthrough;

    router.get('/minhas', requireAuth, reservaController.listarMinhas);

    router.get('/usuario/:usuarioId', requireAuth, reservaController.listarPorUsuario);

    router.get('/quadra/:quadraId', requireAuth, requireGestor, reservaController.listarPorQuadra);

    router.get('/', requireAuth, requireGestor, reservaController.listar);

    router.get('/:id', requireAuth, reservaController.buscarPorId);

    router.post('/', requireAuth, reservaController.criar);

    router.put('/:id', requireAuth, reservaController.atualizar);

    router.patch('/:id/cancelamento', requireAuth, reservaController.cancelar);

    router.delete('/:id', requireAuth, reservaController.deletar);

    return router;
}
