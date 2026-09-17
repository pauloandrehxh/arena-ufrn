import express from 'express';
import cors from 'cors';

import { createQuadraService } from './services/quadra.service.js';
import { createQuadraController } from './controllers/quadra.controller.js';
import { createQuadraRoutes } from './routes/quadra.routes.js';

export function createApp(prisma) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({
            message: 'Arena UFRN API funcionando!'
        });
    });

    app.get('/api/test', (req, res) => {
        res.json({
            message: 'Comunicação com Backend realizada com Sucesso!'
        });
    });

    const quadraService = createQuadraService(prisma);

    const quadraController = createQuadraController(quadraService);

    const quadraRoutes = createQuadraRoutes(quadraController);

    app.use('/api/quadras', quadraRoutes);

    return app;
}