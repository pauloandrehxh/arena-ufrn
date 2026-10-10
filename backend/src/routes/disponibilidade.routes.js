
import { Router } from 'express';

export function createDisponibilidadeRoutes(controller) {
    const router = Router();

    router.get('/', controller.consultar);

    return router;
}
