import { Router } from 'express';

export function createUsuarioRoutes(usuarioController) {
    const router = Router();

    router.get('/', usuarioController.listar);

    router.get('/:id', usuarioController.buscarPorId);

    router.post('/', usuarioController.criar);

    router.put('/:id', usuarioController.atualizar);

    router.delete('/:id', usuarioController.deletar);

    return router;
}