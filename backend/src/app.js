
import express from 'express';
import cors from 'cors';

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

export function createApp(prisma, { agora } = {}) {
    const app = express();

    const allowedOrigins = [
        'http://localhost:5173',
    ];

    app.use(cors({
        origin: allowedOrigins,
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

    // Quadras
    const quadraService = createQuadraService(prisma);
    const quadraController = createQuadraController(quadraService);
    const quadraRoutes = createQuadraRoutes(quadraController);

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
    const usuarioRoutes = createUsuarioRoutes(usuarioController);

    app.use('/api/usuarios', usuarioRoutes);

    // Reservas
    const reservaService = createReservaService(prisma, { agora });
    const reservaController = createReservaController(reservaService);
    const reservaRoutes = createReservaRoutes(reservaController);

    app.use('/api/reservas', reservaRoutes);

    return app;
}
