import path from 'node:path';
import express from 'express';
import prisma from './src/lib/prisma.js';
import { createApp } from './src/app.js';

const PORT = process.env.PORT || 3000;

const app = createApp(prisma);

if (process.env.SERVE_STATIC === 'true') {
    const publicDir = process.env.PUBLIC_DIR || path.resolve('public');

    app.use(express.static(publicDir));

    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api') || req.path === '/health') {
            return next();
        }

        return res.sendFile(path.join(publicDir, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});
