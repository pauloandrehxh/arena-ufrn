import { Router } from 'express';

export function createAuthRoutes(authController, requireAuth) {
    const router = Router();

    router.post('/register', authController.registrar);
    router.post('/login', authController.login);
    router.post('/logout', authController.logout);
    router.get('/me', requireAuth, authController.me);

    return router;
}
