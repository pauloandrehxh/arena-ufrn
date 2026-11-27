import { Router } from 'express';

const passthrough = (req, res, next) => next();

export function createUsuarioRoutes(usuarioController, authMiddlewares = null) {
    const router = Router();
    const requireAuth = authMiddlewares?.requireAuth ?? passthrough;
    const requireGestor = authMiddlewares?.requireRole
        ? authMiddlewares.requireRole('GESTOR')
        : passthrough;

    router.use(requireAuth, requireGestor);

    router.get('/', usuarioController.listar);

    router.get('/:id', usuarioController.buscarPorId);

    router.post('/', usuarioController.criar);

    router.put('/:id', usuarioController.atualizar);

    router.delete('/:id', usuarioController.deletar);

    return router;
}
