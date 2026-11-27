import express from 'express';
import cors from 'cors';

import { createJwtService } from './lib/jwt.js';
import { createAuthMiddlewares } from './middlewares/auth.middleware.js';
import { createAuthService } from './services/auth.service.js';
import { createAuthController } from './controllers/auth.controller.js';
import { createAuthRoutes } from './routes/auth.routes.js';

import { createQuadraService } from './services/quadra.service.js';
import { createQuadraController } from './controllers/quadra.controller.js';
import { createQuadraRoutes } from './routes/quadra.routes.js';

import { createUsuarioService } from './services/usuario.service.js';
import { createUsuarioController } from './controllers/usuario.controller.js';
import { createUsuarioRoutes } from './routes/usuario.routes.js';

import { createReservaService } from './services/reserva.service.js';
import { createReservaController } from './controllers/reserva.controller.js';
import { createReservaRoutes } from './routes/reserva.routes.js';

import { createDisponibilidadeService } from './services/disponibilidade.service.js';
import { createDisponibilidadeController } from './controllers/disponibilidade.controller.js';
import { createDisponibilidadeRoutes } from './routes/disponibilidade.routes.js';

function obterOrigensPermitidas() {
    const raw = process.env.CORS_ORIGINS || 'http://localhost:5173';
    return raw
        .split(',')
        .map((origem) => origem.trim())
        .filter(Boolean);
}

export function createApp(prisma, { agora, jwtSecret } = {}) {
    const app = express();

    const allowedOrigins = obterOrigensPermitidas();

    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
    }));

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({
            message: 'Arena UFRN API funcionando!',
        });
    });

    app.get('/api/test', (req, res) => {
        res.json({
            message: 'Comunicação com Backend realizada com Sucesso!',
        });
    });

    app.get('/health', async (req, res) => {
        const timestamp = new Date().toISOString();
        try {
            if (typeof prisma?.$queryRaw === 'function') {
                await prisma.$queryRaw`SELECT 1`;
            }

            return res.status(200).json({
                status: 'ok',
                service: 'arena-ufrn',
                database: 'up',
                timestamp,
            });
        } catch {
            return res.status(503).json({
                status: 'error',
                service: 'arena-ufrn',
                database: 'down',
                timestamp,
            });
        }
    });

    // Autenticação e Autorização
    const jwtService = createJwtService({ secret: jwtSecret });
    const authMiddlewares = createAuthMiddlewares(prisma, jwtService);
    const authService = createAuthService(prisma, jwtService);
    const authController = createAuthController(authService);
    const authRoutes = createAuthRoutes(authController, authMiddlewares.requireAuth);

    app.use('/api/auth', authRoutes);

    // Quadras
    const quadraService = createQuadraService(prisma);
    const quadraController = createQuadraController(quadraService);
    const quadraRoutes = createQuadraRoutes(quadraController, authMiddlewares);

    // Disponibilidade
    const disponibilidadeService = createDisponibilidadeService(prisma);
    const disponibilidadeController =
        createDisponibilidadeController(disponibilidadeService);
    const disponibilidadeRoutes =
        createDisponibilidadeRoutes(disponibilidadeController);

    // Registrar antes das rotas genéricas de quadras
    app.use('/api/quadras/disponibilidade', disponibilidadeRoutes);
    app.use('/api/quadras', quadraRoutes);

    // Usuários
    const usuarioService = createUsuarioService(prisma);
    const usuarioController = createUsuarioController(usuarioService);
    const usuarioRoutes = createUsuarioRoutes(usuarioController, authMiddlewares);

    app.use('/api/usuarios', usuarioRoutes);

    // Reservas
    const reservaService = createReservaService(prisma, { agora });
    const reservaController = createReservaController(reservaService);
    const reservaRoutes = createReservaRoutes(reservaController, authMiddlewares);

    app.use('/api/reservas', reservaRoutes);

    return app;
}
