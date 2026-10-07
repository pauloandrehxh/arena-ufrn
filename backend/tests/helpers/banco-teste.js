import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function criarBancoTeste() {
    const diretorio = mkdtempSync(join(tmpdir(), 'arena-ufrn-test-'));
    const arquivo = join(diretorio, 'test.db');
    const migrations = fileURLToPath(new URL('../../prisma/migrations/', import.meta.url));
    const banco = new Database(arquivo);

    try {
        banco.pragma('foreign_keys = ON');
        for (const nome of readdirSync(migrations).sort()) {
            if (nome.match(/^\d+_/)) {
                banco.exec(readFileSync(join(migrations, nome, 'migration.sql'), 'utf8'));
            }
        }
    } catch (error) {
        banco.close();
        rmSync(diretorio, { recursive: true, force: true });
        throw error;
    }
    banco.close();

    const prisma = new PrismaClient({
        adapter: new PrismaBetterSqlite3({ url: `file:${arquivo}` }),
    });

    return {
        prisma,
        async fechar() {
            await prisma.$disconnect();
            rmSync(diretorio, { recursive: true, force: true });
        },
    };
}
