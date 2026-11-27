import request from 'supertest';
import { jest, describe, expect, test, beforeAll, afterAll } from '@jest/globals';

import { createApp } from '../../src/app.js';
import { criarBancoTeste } from '../helpers/banco-teste.js';

describe('Integração - health check', () => {
    test('GET /health responde 200 com status ok e database up quando o banco responde', async () => {
        const prismaMock = {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
        };
        const app = createApp(prismaMock);

        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.service).toBe('arena-ufrn');
        expect(response.body.database).toBe('up');
        expect(typeof response.body.timestamp).toBe('string');
        expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
    });

    test('GET /health responde 503 com database down sem vazar detalhes quando o banco falha', async () => {
        const prismaMock = {
            $queryRaw: jest.fn().mockRejectedValue(new Error('SEGREDO_CONEXAO_PG')),
        };
        const app = createApp(prismaMock);

        const response = await request(app).get('/health');

        expect(response.status).toBe(503);
        expect(response.body.status).toBe('error');
        expect(response.body.service).toBe('arena-ufrn');
        expect(response.body.database).toBe('down');
        expect(JSON.stringify(response.body)).not.toContain('SEGREDO_CONEXAO_PG');
    });

    describe('com PostgreSQL real', () => {
        let banco;
        let appReal;

        beforeAll(async () => {
            banco = await criarBancoTeste();
            appReal = createApp(banco.prisma);
        });

        afterAll(async () => {
            if (banco) await banco.fechar();
        });

        test('GET /health executa SELECT 1 no PostgreSQL e responde 200', async () => {
            const response = await request(appReal).get('/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ok');
            expect(response.body.database).toBe('up');
        });
    });
});
