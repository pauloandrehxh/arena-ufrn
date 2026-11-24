import path from 'node:path';
import prisma from './src/lib/prisma.js';
import { createApp } from './src/app.js';
import { createStaticApp, temBuildDoFrontend } from './src/static-app.js';

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = process.env.PUBLIC_DIR || path.resolve('public');

const apiApp = createApp(prisma);

const frontendDisponivel = temBuildDoFrontend(PUBLIC_DIR);
const servirEstatico = process.env.SERVE_STATIC === 'true' || frontendDisponivel;

const app = servirEstatico
    ? createStaticApp(apiApp, PUBLIC_DIR)
    : apiApp;

app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
    console.log(`Frontend estatico: ${servirEstatico ? 'ativo' : 'ausente'} (${PUBLIC_DIR})`);
});
