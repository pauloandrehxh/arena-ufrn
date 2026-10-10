
import request from 'supertest';
import {
    describe,
    test,
    expect,
    beforeAll,
    beforeEach,
    afterAll,
} from '@jest/globals';

import { createApp } from '../../src/app.js';
import { criarBancoTeste } from '../helpers/banco-teste.js';

let banco;
let prisma;
let app;
let usuario;
let quadra;

const dataReserva = new Date('2099-10-10T00:00:00.000Z');

beforeAll(() => {
    banco = criarBancoTeste();
    prisma = banco.prisma;

    app = createApp(prisma, {
        agora: () => new Date('2099-10-01T12:00:00Z'),
    });
});

beforeEach(async () => {
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();

    usuario = await prisma.usuario.create({
        data: {
            name: 'Aluno sintético',
            email: 'disponibilidade@example.com',
            registration: 'US04',
        },
    });

    quadra = await prisma.quadra.create({
        data: { name: 'Quadra sintética', active: true },
    });
});

afterAll(async () => {
    if (banco) await banco.fechar();
});

function dadosReserva(overrides = {}) {
    return {
        usuarioId: usuario.id,
        quadraId: quadra.id,
        date: dataReserva,
        startTime: '14:00',
        endTime: '15:00',
        status: 'ATIVA',
        ...overrides,
    };
}

async function criarReserva(overrides = {}) {
    return prisma.reserva.create({
        data: dadosReserva(overrides),
    });
}

function consultarDisponibilidade(overrides = {}) {
    return request(app)
        .get('/api/quadras/disponibilidade')
        .query({
            quadraId: quadra.id,
            date: '2099-10-10',
            ...overrides,
        });
}

describe('US04 - Consultar disponibilidade', () => {
    test('CA01 (P0): apresenta ocupações ativas e intervalos livres sem sobreposição', async () => {
        await criarReserva({
            startTime: '14:00',
            endTime: '15:00',
        });

        await criarReserva({
            startTime: '16:00',
            endTime: '17:00',
        });

        const resposta = await consultarDisponibilidade();

        expect(resposta.status).toBe(200);
        expect(resposta.body.ocupacoes).toHaveLength(2);
        expect(resposta.body.disponiveis).toEqual(
            expect.arrayContaining([
                { startTime: '08:00', endTime: '09:00' },
                { startTime: '15:00', endTime: '16:00' },
                { startTime: '17:00', endTime: '18:00' },
            ])
        );

        for (const ocupacao of resposta.body.ocupacoes) {
            for (const intervalo of resposta.body.disponiveis) {
                expect(
                    ocupacao.startTime < intervalo.endTime &&
                    intervalo.startTime < ocupacao.endTime
                ).toBe(false);
            }
        }
    });

    test('CA02 (P0): reserva cancelada não bloqueia horário', async () => {
        await criarReserva({
            startTime: '14:00',
            endTime: '15:00',
            status: 'CANCELADA',
        });

        const resposta = await consultarDisponibilidade();

        expect(resposta.status).toBe(200);
        expect(resposta.body.ocupacoes).toHaveLength(0);
        expect(resposta.body.disponiveis).toContainEqual({
            startTime: '14:00',
            endTime: '15:00',
        });
    });

    test('CA02 (P0): horários consecutivos não são considerados sobrepostos', async () => {
        await criarReserva({
            startTime: '14:00',
            endTime: '15:00',
        });

        const resposta = await consultarDisponibilidade();

        expect(resposta.status).toBe(200);
        expect(resposta.body.disponiveis).toContainEqual({
            startTime: '15:00',
            endTime: '16:00',
        });
    });

    test('CA03 (P1): quadra inativa não oferece horários', async () => {
        await prisma.quadra.update({
            where: { id: quadra.id },
            data: { active: false },
        });

        const resposta = await consultarDisponibilidade();

        expect(resposta.status).toBe(409);
        expect(resposta.body.erro).toBe('Quadra indisponível.');
    });

    test('CA03 (P1): quadra inexistente retorna erro explícito', async () => {
        const resposta = await consultarDisponibilidade({
            quadraId: 999999,
        });

        expect(resposta.status).toBe(404);
        expect(resposta.body.erro).toBe('Quadra não encontrada.');
    });

    test('CA03 (P1): data inválida retorna erro explícito', async () => {
        const resposta = await consultarDisponibilidade({
            date: '2099-02-30',
        });

        expect(resposta.status).toBe(400);
        expect(resposta.body.erro).toMatch(/Data inválida/);
    });

    test('CA03 (P1): parâmetros ausentes ou inválidos são rejeitados', async () => {
        const semQuadra = await request(app)
            .get('/api/quadras/disponibilidade')
            .query({ date: '2099-10-10' });

        const semData = await request(app)
            .get('/api/quadras/disponibilidade')
            .query({ quadraId: quadra.id });

        const idInvalido = await consultarDisponibilidade({
            quadraId: 'abc',
        });

        expect(semQuadra.status).toBe(400);
        expect(semData.status).toBe(400);
        expect(idInvalido.status).toBe(400);
    });

    test('CA04 (P1): dia sem reservas oferece todos os intervalos permitidos', async () => {
        const resposta = await consultarDisponibilidade();

        expect(resposta.status).toBe(200);
        expect(resposta.body.ocupacoes).toHaveLength(0);
        expect(resposta.body.disponiveis).toHaveLength(14);
        expect(resposta.body.disponiveis[0]).toEqual({
            startTime: '08:00',
            endTime: '09:00',
        });
        expect(resposta.body.disponiveis.at(-1)).toEqual({
            startTime: '21:00',
            endTime: '22:00',
        });
    });

    test('CA05 (P1): informa a janela e a duração usadas para calcular os intervalos', async () => {
        const resposta = await consultarDisponibilidade();

        expect(resposta.status).toBe(200);
        expect(resposta.body.horarioFuncionamento).toEqual({
            inicio: '08:00',
            fim: '22:00',
            duracaoMinutos: 60,
        });

        for (const intervalo of resposta.body.disponiveis) {
            const inicio = Number(intervalo.startTime.slice(0, 2)) * 60 +
                Number(intervalo.startTime.slice(3, 5));
            const fim = Number(intervalo.endTime.slice(0, 2)) * 60 +
                Number(intervalo.endTime.slice(3, 5));

            expect(fim - inicio).toBe(60);
        }
    });
});
