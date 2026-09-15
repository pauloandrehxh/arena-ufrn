import prisma from './src/lib/prisma.js';
import { createApp } from './src/app.js';

const PORT = process.env.PORT || 3000;

const app = createApp(prisma);

app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});