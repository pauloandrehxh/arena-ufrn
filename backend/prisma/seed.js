import 'dotenv/config';
import prisma from '../src/lib/prisma.js';
import { hashSenha } from '../src/lib/password.js';

async function main() {
    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'gestor@ufrn.br').trim().toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Arena@123';
    const adminHash = await hashSenha(adminPassword);

    await prisma.usuario.upsert({
        where: { email: adminEmail },
        update: {
            name: 'Gestor Esportivo UFRN',
            role: 'GESTOR',
            active: true,
        },
        create: {
            name: 'Gestor Esportivo UFRN',
            email: adminEmail,
            registration: 'GESTOR001',
            passwordHash: adminHash,
            role: 'GESTOR',
            active: true,
        },
    });

    const alunoHash = await hashSenha('Arena@123');
    await prisma.usuario.upsert({
        where: { email: 'aluno@ufrn.br' },
        update: {},
        create: {
            name: 'Aluno Demonstração',
            email: 'aluno@ufrn.br',
            registration: '202600001',
            passwordHash: alunoHash,
            role: 'ALUNO',
            active: true,
        },
    });

    const totalQuadras = await prisma.quadra.count();
    if (totalQuadras === 0) {
        await prisma.quadra.createMany({
            data: [
                {
                    name: 'Quadra de Areia 1 — Principal',
                    sport: 'Vôlei de Praia e Futevôlei',
                    description: 'Quadra principal com iluminação noturna, rede oficial e arquibancada no Parque Poliesportivo da UFRN.',
                    active: true,
                },
                {
                    name: 'Quadra de Areia 2 — Beach Tennis',
                    sport: 'Beach Tennis',
                    description: 'Areia nivelada com marcação oficial e altura de rede ajustável para jogos em duplas e simples.',
                    active: true,
                },
                {
                    name: 'Quadra de Areia 3 — Treinos',
                    sport: 'Vôlei de Praia / Futevôlei / Beach Tennis',
                    description: 'Espaço multiuso ideal para treinos coletivos, recreação estudantil e torneios internos.',
                    active: true,
                },
            ],
        });
    }

    console.log('Seed concluído com sucesso!');
    console.log(`Gestor: ${adminEmail} / ${adminPassword}`);
    console.log('Aluno demo: aluno@ufrn.br / Arena@123');
}

main()
    .catch((error) => {
        console.error('Erro ao executar seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
