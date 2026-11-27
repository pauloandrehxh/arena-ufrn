import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

function montarConnectionStringComSchema(baseUrl, schema) {
    const url = new URL(baseUrl);
    url.searchParams.set('schema', schema);
    return url.toString();
}

export async function criarBancoTeste() {
    const baseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

    if (!baseUrl) {
        throw new Error('TEST_DATABASE_URL ou DATABASE_URL deve estar definida para os testes com PostgreSQL.');
    }

    const schema = `test_${randomUUID().replace(/-/g, '')}`;
    const adminPool = new Pool({ connectionString: baseUrl });
    const migrationsDir = fileURLToPath(new URL('../../prisma/migrations/', import.meta.url));

    const client = await adminPool.connect();
    try {
        await client.query(`CREATE SCHEMA "${schema}"`);
        await client.query(`SET search_path TO "${schema}"`);

        const pastas = readdirSync(migrationsDir)
            .filter((nome) => /^\d+_/.test(nome))
            .sort();

        for (const pasta of pastas) {
            const sql = readFileSync(join(migrationsDir, pasta, 'migration.sql'), 'utf8');
            if (sql.trim()) {
                await client.query(sql);
            }
        }
    } catch (error) {
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`).catch(() => {});
        client.release();
        await adminPool.end();
        throw error;
    }
    client.release();

    const connectionString = montarConnectionStringComSchema(baseUrl, schema);
    const prismaPool = new Pool({
        connectionString,
        options: `-c search_path=${schema}`,
    });

    const adapter = new PrismaPg(prismaPool, {
        schema,
        disposeExternalPool: true,
    });

    const prisma = new PrismaClient({ adapter });

    return {
        prisma,
        schema,
        async fechar() {
            await prisma.$disconnect();
            try {
                await adminPool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
            } finally {
                await adminPool.end();
            }
        },
    };
}
