import path from 'node:path';
import prisma from './src/lib/prisma.js';
import { createApp } from './src/app.js';
import { createStaticApp } from './src/static-app.js';

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = process.env.PUBLIC_DIR || path.resolve('public');

const apiApp = createApp(prisma);

const app = process.env.SERVE_STATIC === 'true'
    ? createStaticApp(apiApp, PUBLIC_DIR)
    : apiApp;

app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});
