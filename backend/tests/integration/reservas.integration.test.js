import express from 'express';
import request from 'supertest';

import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
} from '@jest/globals';

import { createReservaService } from '../../src/services/reserva.service.js';
import { createReservaController } from '../../src/controllers/reserva.controller.js';
import { createReservaRoutes } from '../../src/routes/reserva.routes.js';

const prismaMock = {
    $transaction: jest.fn(),
    usuario: {
        findUnique: jest.fn(),
    },

    quadra: {
        findUnique: jest.fn(),
    },

    reserva: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

const reservaService = createReservaService(prismaMock);
const reservaController = createReservaController(reservaService);
const reservaRoutes = createReservaRoutes(reservaController);

const app = express();

app.use(express.json());
app.use('/api/reservas', reservaRoutes);

beforeEach(() => {
    jest.resetAllMocks();
    prismaMock.$transaction.mockImplementation((operacao) => operacao(prismaMock));
});

describe('Integração - API de reservas', () => {
    describe('GET /api/reservas', () => {
        test('deve retornar todas as reservas', async () => {
            const reservas = [
                {
                    id: 1,
                    usuarioId: 1,
                    quadraId: 1,
                    date: '2099-10-10T00:00:00.000Z',
                    startTime: '14:00',
                    endTime: '15:00',
                },
            ];

            prismaMock.reserva.findMany.mockResolvedValue(reservas);

            const response = await request(app)
                .get('/api/reservas');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(reservas);
        });
    });

    describe('GET /api/reservas/:id', () => {
        test('deve retornar uma reserva pelo id', async () => {
            const reserva = {
                id: 1,
                usuarioId: 1,
                quadraId: 1,
                date: '2099-10-10T00:00:00.000Z',
                startTime: '14:00',
                endTime: '15:00',
            };

            prismaMock.reserva.findUnique.mockResolvedValue(reserva);

            const response = await request(app)
                .get('/api/reservas/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(reserva);

            expect(prismaMock.reserva.findUnique)
                .toHaveBeenCalledWith({
                    where: { id: 1 },
                    include: {
                        usuario: true,
                        quadra: true,
                    },
                });
        });

        test('deve retornar 404 quando a reserva não existir', async () => {
            prismaMock.reserva.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/reservas/999');

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: 'Reserva não encontrada.',
            });
        });

        test('deve retornar 400 para id inválido', async () => {
            const response = await request(app)
                .get('/api/reservas/abc');

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'ID inválido.',
            });

            expect(prismaMock.reserva.findUnique)
                .not.toHaveBeenCalled();
        });
    });

    describe('GET /api/reservas/usuario/:usuarioId', () => {
        test('deve retornar as reservas de um usuário', async () => {
            const reservas = [
                {
                    id: 1,
                    usuarioId: 1,
                    quadraId: 1,
                    startTime: '14:00',
                    endTime: '15:00',
                },
            ];

            prismaMock.reserva.findMany.mockResolvedValue(reservas);

            const response = await request(app)
                .get('/api/reservas/usuario/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(reservas);

            expect(prismaMock.reserva.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        usuarioId: 1,
                    },
                    include: {
                        quadra: true,
                    },
                });
        });

        test('deve retornar 400 para id de usuário inválido', async () => {
            const response = await request(app)
                .get('/api/reservas/usuario/abc');

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'ID de usuário inválido.',
            });
        });
    });

    describe('GET /api/reservas/quadra/:quadraId', () => {
        test('deve retornar as reservas de uma quadra', async () => {
            const reservas = [
                {
                    id: 1,
                    usuarioId: 1,
                    quadraId: 1,
                    startTime: '14:00',
                    endTime: '15:00',
                },
            ];

            prismaMock.reserva.findMany.mockResolvedValue(reservas);

            const response = await request(app)
                .get('/api/reservas/quadra/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(reservas);

            expect(prismaMock.reserva.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        quadraId: 1,
                    },
                    include: {
                        usuario: true,
                    },
                });
        });

        test('deve retornar 400 para id de quadra inválido', async () => {
            const response = await request(app)
                .get('/api/reservas/quadra/abc');

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'ID de quadra inválido.',
            });
        });
    });

    describe('POST /api/reservas', () => {
        test.each([
            ['usuarioId', '1'], ['usuarioId', -1], ['quadraId', 1.5],
            ['date', '2099-02-30'], ['date', '2099-10-10T00:00:00Z'],
            ['date', 123], ['startTime', '9:00'], ['startTime', '24:00'],
            ['endTime', '15:60'], ['endTime', ['15:00']],
        ])('retorna 400 para %s=%p sem persistir', async (campo, valor) => {
            const response = await request(app).post('/api/reservas').send({
                usuarioId: 1, quadraId: 1, date: '2099-10-10',
                startTime: '14:00', endTime: '15:00', [campo]: valor,
            });
            expect(response.status).toBe(400);
            expect(prismaMock.reserva.create).not.toHaveBeenCalled();
        });

        test('retorna 500 sem expor erro interno de persistência', async () => {
            prismaMock.usuario.findUnique.mockRejectedValue(new Error('segredo do banco'));
            const response = await request(app).post('/api/reservas').send({
                usuarioId: 1, quadraId: 1, date: '2099-10-10',
                startTime: '14:00', endTime: '15:00',
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Erro ao criar reserva.' });
            expect(prismaMock.reserva.create).not.toHaveBeenCalled();
        });

        test('deve criar uma reserva válida', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.reserva.findFirst.mockResolvedValue(null);

            prismaMock.reserva.create.mockResolvedValue({
                id: 1,
                usuarioId: 1,
                quadraId: 1,
                date: new Date('2099-10-10'),
                startTime: '14:00',
                endTime: '15:00',
            });

            const response = await request(app)
                .post('/api/reservas')
                .send({
                    usuarioId: 1,
                    quadraId: 1,
                    date: '2099-10-10',
                    startTime: '14:00',
                    endTime: '15:00',
                });

            expect(response.status).toBe(201);

            expect(response.body).toMatchObject({
                id: 1,
                usuarioId: 1,
                quadraId: 1,
                startTime: '14:00',
                endTime: '15:00',
            });

            expect(prismaMock.reserva.create)
                .toHaveBeenCalled();
        });

        test('deve retornar 400 quando faltarem campos obrigatórios', async () => {
            const response = await request(app)
                .post('/api/reservas')
                .send({
                    usuarioId: 1,
                    quadraId: 1,
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'Todos os campos são obrigatórios.',
            });

            expect(prismaMock.reserva.create)
                .not.toHaveBeenCalled();
        });

        test('deve retornar 400 quando houver conflito de horário', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.reserva.findFirst.mockResolvedValue({
                id: 10,
                quadraId: 1,
                startTime: '14:00',
                endTime: '15:00',
            });

            const response = await request(app)
                .post('/api/reservas')
                .send({
                    usuarioId: 1,
                    quadraId: 1,
                    date: '2099-10-10',
                    startTime: '14:30',
                    endTime: '15:30',
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message:
                    'Já existe uma reserva para essa quadra nesse horário.',
            });

            expect(prismaMock.reserva.create)
                .not.toHaveBeenCalled();
        });
    });

    describe('PUT /api/reservas/:id', () => {
        test('retorna 400 sem atualizar data de calendário inválida', async () => {
            prismaMock.reserva.findUnique.mockResolvedValue({ id: 1 });
            const response = await request(app).put('/api/reservas/1').send({ date: '2099-02-30' });
            expect(response.status).toBe(400);
            expect(prismaMock.reserva.update).not.toHaveBeenCalled();
        });

        test('retorna 400 para horário inválido sem atualizar reserva', async () => {
            prismaMock.reserva.findUnique.mockResolvedValue({
                id: 1, usuarioId: 1, quadraId: 1, date: new Date('2099-10-10'),
                startTime: '14:00', endTime: '15:00', status: 'ATIVA',
            });
            const response = await request(app).put('/api/reservas/1').send({ startTime: '24:00' });
            expect(response.status).toBe(400);
            expect(prismaMock.reserva.update).not.toHaveBeenCalled();
        });

        test('deve atualizar uma reserva', async () => {
            const reservaExistente = {
                id: 1,
                status: 'ATIVA',
                usuarioId: 1,
                quadraId: 1,
                date: new Date('2099-10-10'),
                startTime: '14:00',
                endTime: '15:00',
            };

            const reservaAtualizada = {
                ...reservaExistente,
                startTime: '15:00',
                endTime: '16:00',
            };

            prismaMock.reserva.findUnique
                .mockResolvedValue(reservaExistente);

            prismaMock.reserva.findFirst
                .mockResolvedValue(null);

            prismaMock.reserva.update
                .mockResolvedValue(reservaAtualizada);

            const response = await request(app)
                .put('/api/reservas/1')
                .send({
                    startTime: '15:00',
                    endTime: '16:00',
                });

            expect(response.status).toBe(200);

            expect(response.body).toMatchObject({
                id: 1,
                startTime: '15:00',
                endTime: '16:00',
            });
        });

        test('deve retornar 404 quando tentar atualizar reserva inexistente', async () => {
            prismaMock.reserva.findUnique
                .mockResolvedValue(null);

            const response = await request(app)
                .put('/api/reservas/999')
                .send({
                    startTime: '15:00',
                    endTime: '16:00',
                });

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: 'Reserva não encontrada.',
            });
        });

        test('deve retornar 400 para id inválido na atualização', async () => {
            const response = await request(app)
                .put('/api/reservas/abc')
                .send({
                    startTime: '15:00',
                    endTime: '16:00',
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'ID inválido.',
            });
        });
    });

    describe('DELETE /api/reservas/:id', () => {
        test('deve cancelar logicamente pelo DELETE, sem apagar registro', async () => {
            const reserva = {
                id: 1,
                usuarioId: 1,
                quadraId: 1,
                status: 'ATIVA', date: new Date('2099-10-10'), startTime: '14:00', endTime: '15:00',
            };

            prismaMock.reserva.findUnique
                .mockResolvedValue(reserva);

            prismaMock.reserva.update.mockResolvedValue({ ...reserva, status: 'CANCELADA' });

            const response = await request(app)
                .delete('/api/reservas/1');

            expect(response.status).toBe(204);

            expect(prismaMock.reserva.update)
                .toHaveBeenCalledWith({
                    where: {
                        id: 1, status: 'ATIVA', date: reserva.date, startTime: reserva.startTime,
                    },
                    data: { status: 'CANCELADA' },
                    include: { usuario: true, quadra: true },
                });
            expect(prismaMock.reserva.delete).not.toHaveBeenCalled();
        });

        test('deve retornar 404 ao tentar deletar reserva inexistente', async () => {
            prismaMock.reserva.findUnique
                .mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/reservas/999');

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: 'Reserva não encontrada.',
            });

            expect(prismaMock.reserva.delete)
                .not.toHaveBeenCalled();
        });

        test('deve retornar 400 para id inválido na exclusão', async () => {
            const response = await request(app)
                .delete('/api/reservas/abc');

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: 'ID da reserva deve ser um inteiro positivo válido.',
            });
        });
    });
});
