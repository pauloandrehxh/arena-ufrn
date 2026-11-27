import request from 'supertest';
import { describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { createJwtService } from '../../src/lib/jwt.js';
import { hashSenha } from '../../src/lib/password.js';
import { criarBancoTeste } from '../helpers/banco-teste.js';

let banco;
let prisma;
let app;
let usuario;
let gestor;
let quadra;
let tokenUsuario;
let tokenGestor;
let senhaHash;

const jwtService = createJwtService();

beforeAll(async () => {
    banco = await criarBancoTeste();
    prisma = banco.prisma;
    app = createApp(prisma);
    senhaHash = await hashSenha('Arena@123');
});

beforeEach(async () => {
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();

    usuario = await prisma.usuario.create({
        data: {
            name: 'Aluno de teste',
            email: 'teste@example.com',
            registration: 'TESTE01',
            passwordHash: senhaHash,
            role: 'ALUNO',
        },
    });
    gestor = await prisma.usuario.create({
        data: {
            name: 'Gestor de teste',
            email: 'gestor@example.com',
            registration: 'GESTOR01',
            passwordHash: senhaHash,
            role: 'GESTOR',
        },
    });
    quadra = await prisma.quadra.create({ data: { name: 'Quadra de teste' } });
    tokenUsuario = await jwtService.assinarToken(usuario);
    tokenGestor = await jwtService.assinarToken(gestor);
});

afterAll(async () => {
    if (banco) await banco.fechar();
});

function dados(overrides = {}) {
    return {
        usuarioId: usuario.id,
        quadraId: quadra.id,
        date: '2099-10-10',
        startTime: '14:00',
        endTime: '15:00',
        ...overrides,
    };
}

function postReserva(body = dados(), token = tokenUsuario) {
    return request(app)
        .post('/api/reservas')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
}

describe('US01 - aplicação completa com PostgreSQL isolado', () => {
    test('cria ATIVA e permite consultar o registro persistido', async () => {
        const criada = await postReserva(dados({ status: 'CANCELADA' }));
        expect(criada.status).toBe(201);
        expect(criada.body.status).toBe('ATIVA');
        expect(criada.body.date).toBe('2099-10-10T00:00:00.000Z');
        expect(criada.body.usuario.passwordHash).toBeUndefined();

        const consulta = await request(app)
            .get(`/api/reservas/${criada.body.id}`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        expect(consulta.status).toBe(200);
        expect(consulta.body.id).toBe(criada.body.id);
        expect(await prisma.reserva.count()).toBe(1);
    });

    test.each([
        ['14:00', '15:00'], ['14:30', '15:30'],
        ['13:30', '14:30'], ['13:00', '16:00'], ['14:15', '14:45'],
    ])('rejeita sobreposição real %s–%s sem criar registro', async (startTime, endTime) => {
        expect((await postReserva()).status).toBe(201);
        const segunda = await postReserva(dados({ startTime, endTime }));
        expect(segunda.status).toBe(400);
        expect(await prisma.reserva.count()).toBe(1);
    });

    test.each([['13:00', '14:00'], ['15:00', '16:00']])(
        'permite intervalo contíguo %s–%s com consulta real', async (startTime, endTime) => {
            expect((await postReserva()).status).toBe(201);
            const segunda = await postReserva(dados({ startTime, endTime }));
            expect(segunda.status).toBe(201);
            expect(await prisma.reserva.count()).toBe(2);
        }
    );

    test('CANCELADA não bloqueia uma nova reserva', async () => {
        await prisma.reserva.create({
            data: { ...dados(), date: new Date('2099-10-10'), status: 'CANCELADA' },
        });
        const criada = await postReserva();
        expect(criada.status).toBe(201);
        expect(await prisma.reserva.count({ where: { status: 'ATIVA' } })).toBe(1);
        expect(await prisma.reserva.count()).toBe(2);
    });

    test('não mistura quadras ou datas diferentes', async () => {
        expect((await postReserva()).status).toBe(201);
        const outraQuadra = await prisma.quadra.create({ data: { name: 'Outra quadra' } });
        expect((await postReserva(dados({ quadraId: outraQuadra.id }))).status).toBe(201);
        expect((await postReserva(dados({ date: '2099-10-11' }))).status).toBe(201);
        expect(await prisma.reserva.count()).toBe(3);
    });

    test('usuário inativo não gera registro', async () => {
        await prisma.usuario.update({ where: { id: usuario.id }, data: { active: false } });
        expect((await postReserva(dados({ usuarioId: usuario.id }), tokenGestor)).status).toBe(400);
        expect((await postReserva(dados(), tokenUsuario)).status).toBe(401);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test('quadra inativa não gera registro', async () => {
        await prisma.quadra.update({ where: { id: quadra.id }, data: { active: false } });
        expect((await postReserva()).status).toBe(400);
        expect(await prisma.reserva.count()).toBe(0);
    });

    test('duas requisições simultâneas não persistem reservas sobrepostas', async () => {
        const respostas = await Promise.all([
            postReserva(),
            postReserva(),
        ]);
        expect(respostas.map(({ status }) => status).sort()).toEqual([201, 400]);
        expect(await prisma.reserva.count({ where: { status: 'ATIVA' } })).toBe(1);
    });
});
