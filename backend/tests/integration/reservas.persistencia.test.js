import request from 'supertest';
import { describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { criarBancoTeste } from '../helpers/banco-teste.js';

let banco;
let prisma;
let app;
let usuario;
let quadra;

beforeAll(() => {
    banco = criarBancoTeste();
    prisma = banco.prisma;
    app = createApp(prisma);
});

beforeEach(async () => {
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();
    usuario = await prisma.usuario.create({
        data: { name: 'Aluno de teste', email: 'teste@example.com', registration: 'TESTE01' },
    });
    quadra = await prisma.quadra.create({ data: { name: 'Quadra de teste' } });
});

afterAll(async () => {
    if (banco) await banco.fechar();
});

function dados(overrides = {}) {
    return {
        usuarioId: usuario.id, quadraId: quadra.id,
        date: '2099-10-10', startTime: '14:00', endTime: '15:00',
        ...overrides,
    };
}

describe('US01 - aplicação completa com SQLite isolado', () => {
    test('cria ATIVA e permite consultar o registro persistido', async () => {
        const criada = await request(app).post('/api/reservas').send(dados({ status: 'CANCELADA' }));
        expect(criada.status).toBe(201);
        expect(criada.body.status).toBe('ATIVA');
        expect(criada.body.date).toBe('2099-10-10T00:00:00.000Z');
        const consulta = await request(app).get(`/api/reservas/${criada.body.id}`);
        expect(consulta.status).toBe(200);
        expect(consulta.body.id).toBe(criada.body.id);
        expect(await prisma.reserva.count()).toBe(1);
    });

    test.each([
        ['14:00', '15:00'], ['14:30', '15:30'],
        ['13:30', '14:30'], ['13:00', '16:00'], ['14:15', '14:45'],
    ])('rejeita sobreposição real %s–%s sem criar registro', async (startTime, endTime) => {
        expect((await request(app).post('/api/reservas').send(dados())).status).toBe(201);
        const segunda = await request(app).post('/api/reservas').send(dados({ startTime, endTime }));
        expect(segunda.status).toBe(400);
        expect(await prisma.reserva.count()).toBe(1);
    });

    test.each([['13:00', '14:00'], ['15:00', '16:00']])(
        'permite intervalo contíguo %s–%s com consulta real', async (startTime, endTime) => {
            expect((await request(app).post('/api/reservas').send(dados())).status).toBe(201);
            const segunda = await request(app).post('/api/reservas').send(dados({ startTime, endTime }));
            expect(segunda.status).toBe(201);
            expect(await prisma.reserva.count()).toBe(2);
        }
    );

    test('CANCELADA não bloqueia uma nova reserva', async () => {
        await prisma.reserva.create({
            data: { ...dados(), date: new Date('2099-10-10'), status: 'CANCELADA' },
        });
        const criada = await request(app).post('/api/reservas').send(dados());
        expect(criada.status).toBe(201);
        expect(await prisma.reserva.count({ where: { status: 'ATIVA' } })).toBe(1);
        expect(await prisma.reserva.count()).toBe(2);
    });

    test('não mistura quadras ou datas diferentes', async () => {
        expect((await request(app).post('/api/reservas').send(dados())).status).toBe(201);
        const outraQuadra = await prisma.quadra.create({ data: { name: 'Outra quadra' } });
        expect((await request(app).post('/api/reservas')
            .send(dados({ quadraId: outraQuadra.id }))).status).toBe(201);
        expect((await request(app).post('/api/reservas')
            .send(dados({ date: '2099-10-11' }))).status).toBe(201);
        expect(await prisma.reserva.count()).toBe(3);
    });

    test('usuário inativo não gera registro', async () => {
        await prisma.usuario.update({ where: { id: usuario.id }, data: { active: false } });
        expect((await request(app).post('/api/reservas').send(dados())).status).toBe(400);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test('quadra inativa não gera registro', async () => {
        await prisma.quadra.update({ where: { id: quadra.id }, data: { active: false } });
        expect((await request(app).post('/api/reservas').send(dados())).status).toBe(400);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test('duas requisições simultâneas não persistem reservas sobrepostas', async () => {
        const respostas = await Promise.all([
            request(app).post('/api/reservas').send(dados()),
            request(app).post('/api/reservas').send(dados()),
        ]);
        expect(respostas.map(({ status }) => status).sort()).toEqual([201, 400]);
        expect(await prisma.reserva.count({ where: { status: 'ATIVA' } })).toBe(1);
    });
});
