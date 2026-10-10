import request from 'supertest';
import { describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { criarBancoTeste } from '../helpers/banco-teste.js';

let banco;
let prisma;
let app;
let usuario;
let quadra;
let instante;

beforeAll(() => {
    banco = criarBancoTeste();
    prisma = banco.prisma;
    app = createApp(prisma, { agora: () => instante });
});
beforeEach(async () => {
    instante = new Date('2099-10-10T16:00:00Z');
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();
    usuario = await prisma.usuario.create({ data: {
        name: 'Aluno sintético', email: 'cancelamento@example.com', registration: 'US03',
    } });
    quadra = await prisma.quadra.create({ data: { name: 'Quadra sintética' } });
});
afterAll(async () => { if (banco) await banco.fechar(); });

function dados(overrides = {}) {
    return { usuarioId: usuario.id, quadraId: quadra.id, date: new Date('2099-10-10'),
        startTime: '14:00', endTime: '15:00', ...overrides };
}
async function criar(overrides = {}) {
    return prisma.reserva.create({ data: dados(overrides) });
}

describe('US03 - aplicação completa e persistência real', () => {
    test('PATCH preserva todos os campos e libera horário para outra reserva', async () => {
        const original = await criar();
        const resposta = await request(app).patch(`/api/reservas/${original.id}/cancelamento`);
        expect(resposta.status).toBe(200);
        expect(resposta.body.status).toBe('CANCELADA');
        const consulta = await request(app).get(`/api/reservas/${original.id}`);
        expect(consulta.status).toBe(200);
        expect(consulta.body.status).toBe('CANCELADA');
        expect(await prisma.reserva.findUnique({ where: { id: original.id } }))
            .toEqual({ ...original, status: 'CANCELADA' });
        const nova = await request(app).post('/api/reservas').send({ ...dados(), date: '2099-10-10' });
        expect(nova.status).toBe(201);
        expect(nova.body.id).not.toBe(original.id);
        expect(await prisma.reserva.count()).toBe(2);
        expect(await prisma.reserva.count({ where: { status: 'ATIVA' } })).toBe(1);
    });

    test('PATCH repetido é idempotente mesmo após o horário passar', async () => {
        const original = await criar();
        expect((await request(app).patch(`/api/reservas/${original.id}/cancelamento`)).status).toBe(200);
        instante = new Date('2100-01-01');
        expect((await request(app).patch(`/api/reservas/${original.id}/cancelamento`)).status).toBe(200);
        expect(await prisma.reserva.count()).toBe(1);
        expect(await prisma.reserva.findUnique({ where: { id: original.id } }))
            .toEqual({ ...original, status: 'CANCELADA' });
    });

    test('DELETE repetido retorna 204 e mantém histórico', async () => {
        const original = await criar();
        expect((await request(app).delete(`/api/reservas/${original.id}`)).status).toBe(204);
        expect((await request(app).delete(`/api/reservas/${original.id}`)).status).toBe(204);
        expect(await prisma.reserva.findUnique({ where: { id: original.id } }))
            .toEqual({ ...original, status: 'CANCELADA' });
    });

    test.each(['patch', 'delete'])('%s retorna 404 sem registro novo', async (method) => {
        const path = method === 'patch' ? '/api/reservas/2147483647/cancelamento' : '/api/reservas/2147483647';
        expect((await request(app)[method](path)).status).toBe(404);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test.each(['abc', '0', '-1', '1.5', '2147483648'])('rejeita ID %s em PATCH e DELETE', async (id) => {
        expect((await request(app).patch(`/api/reservas/${id}/cancelamento`)).status).toBe(400);
        expect((await request(app).delete(`/api/reservas/${id}`)).status).toBe(400);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test.each([
        ['CONCLUIDA', '2099-10-10T16:00:00Z'],
        ['ATIVA', '2099-10-10T17:00:00Z'],
        ['ATIVA', '2099-10-10T17:01:00Z'],
        ['ATIVA', '2099-10-11T03:00:00Z'],
    ])('rejeita %s no instante %s em ambas as rotas', async (status, agora) => {
        const original = await criar({ status });
        instante = new Date(agora);
        expect((await request(app).patch(`/api/reservas/${original.id}/cancelamento`)).status).toBe(409);
        expect((await request(app).delete(`/api/reservas/${original.id}`)).status).toBe(409);
        expect(await prisma.reserva.findUnique({ where: { id: original.id } })).toEqual(original);
    });

    test('fronteira UTC respeita o dia de Fortaleza', async () => {
        const original = await criar({ date: new Date('2099-10-09'), startTime: '23:45', endTime: '23:59' });
        instante = new Date('2099-10-10T02:30:00Z');
        expect((await request(app).patch(`/api/reservas/${original.id}/cancelamento`)).status).toBe(200);
    });

    test.each(['ATIVA', 'CANCELADA', 'CONCLUIDA'])('PUT não aceita estado %s', async (status) => {
        const original = await criar();
        expect((await request(app).put(`/api/reservas/${original.id}`).send({ status })).status).toBe(400);
        expect(await prisma.reserva.findUnique({ where: { id: original.id } })).toEqual(original);
    });

    test.each(['0', '-1', '1.5', '2147483648'])('PUT rejeita ID %s antes de consultar', async (id) => {
        expect((await request(app).put(`/api/reservas/${id}`).send({ startTime: '14:30' })).status).toBe(400);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test.each([{ id: 999 }, { createdAt: '2100-01-01' }, { usuario: { connect: { id: 999 } } }])(
        'PUT rejeita campos internos/relacionais %p e preserva histórico', async (body) => {
            const original = await criar();
            expect((await request(app).put(`/api/reservas/${original.id}`).send(body)).status).toBe(400);
            expect(await prisma.reserva.findUnique({ where: { id: original.id } })).toEqual(original);
        }
    );

    test('PUT não altera dados de reserva CANCELADA', async () => {
        const original = await criar({ status: 'CANCELADA' });
        expect((await request(app).put(`/api/reservas/${original.id}`).send({ startTime: '14:30' })).status).toBe(409);
        expect(await prisma.reserva.findUnique({ where: { id: original.id } })).toEqual(original);
    });

    test('PUT não move reserva iniciada para contornar a rejeição de cancelamento', async () => {
        const original = await criar();
        instante = new Date('2099-10-10T17:00:00Z');
        expect((await request(app).put(`/api/reservas/${original.id}`).send({ date: '2099-10-11' })).status).toBe(409);
        expect(await prisma.reserva.findUnique({ where: { id: original.id } })).toEqual(original);
    });

    test('falha real de UPDATE no SQLite não cancela nem libera o horário', async () => {
        const original = await criar();
        await prisma.$executeRawUnsafe(`CREATE TRIGGER impedir_cancelamento
            BEFORE UPDATE OF status ON Reserva WHEN NEW.status = 'CANCELADA'
            BEGIN SELECT RAISE(ABORT, 'falha_sintetica'); END;`);
        try {
            const resposta = await request(app).patch(`/api/reservas/${original.id}/cancelamento`);
            expect(resposta.status).toBe(500);
            expect(resposta.body).toEqual({ message: 'Erro ao cancelar reserva.' });
            expect(await prisma.reserva.findUnique({ where: { id: original.id } })).toEqual(original);
            const nova = await request(app).post('/api/reservas').send({ ...dados(), date: '2099-10-10' });
            expect(nova.status).toBe(400);
            expect(await prisma.reserva.count()).toBe(1);
        } finally {
            await prisma.$executeRawUnsafe('DROP TRIGGER impedir_cancelamento');
        }
    });

    test('dois cancelamentos simultâneos são idempotentes no mesmo client', async () => {
        const original = await criar();
        const respostas = await Promise.all([
            request(app).patch(`/api/reservas/${original.id}/cancelamento`),
            request(app).patch(`/api/reservas/${original.id}/cancelamento`),
        ]);
        expect(respostas.map((r) => r.status)).toEqual([200, 200]);
        expect(await prisma.reserva.count()).toBe(1);
        expect((await prisma.reserva.findUnique({ where: { id: original.id } })).status).toBe('CANCELADA');
    });

    test('erro de dependência em PATCH/DELETE é 500 genérico', async () => {
        const appComFalha = createApp({ $transaction: async () => { throw new Error('SEGREDO_BANCO'); } });
        for (const [method, path] of [['patch', '/api/reservas/1/cancelamento'], ['delete', '/api/reservas/1']]) {
            const resposta = await request(appComFalha)[method](path);
            expect(resposta.status).toBe(500);
            expect(resposta.body).toEqual({ message: 'Erro ao cancelar reserva.' });
        }
    });

    test('cancelamento e criação simultâneos não deixam duas reservas ATIVA', async () => {
        const original = await criar();
        const [cancelamento, criacao] = await Promise.all([
            request(app).patch(`/api/reservas/${original.id}/cancelamento`),
            request(app).post('/api/reservas').send({ ...dados(), date: '2099-10-10' }),
        ]);
        expect(cancelamento.status).toBe(200);
        expect([201, 400]).toContain(criacao.status);
        expect(await prisma.reserva.count({ where: { status: 'ATIVA' } }))
            .toBe(criacao.status === 201 ? 1 : 0);
        expect((await prisma.reserva.findUnique({ where: { id: original.id } })).status).toBe('CANCELADA');
    });
});
