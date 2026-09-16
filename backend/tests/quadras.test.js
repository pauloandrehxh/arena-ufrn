import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
    afterEach
} from '@jest/globals';

import request from 'supertest';
import { createApp } from '../src/app.js';

const prismaMock = {
    quadra: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
};

const app = createApp(prismaMock);

let consoleErrorSpy;

beforeEach(() => {
    jest.clearAllMocks();

    consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

describe('GET /api/quadras', () => {
    test('deve retornar todas as quadras', async () => {
        const quadras = [
            { id: 1, name: 'Quadra 1', active: true },
            { id: 2, name: 'Quadra 2', active: true }
        ];

        prismaMock.quadra.findMany.mockResolvedValue(quadras);

        const response = await request(app)
            .get('/api/quadras');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(quadras);
        expect(prismaMock.quadra.findMany).toHaveBeenCalledTimes(1);
    });

    test('deve retornar 500 quando ocorrer erro no banco', async () => {
        prismaMock.quadra.findMany.mockRejectedValue(
            new Error('Erro no banco')
        );

        const response = await request(app)
            .get('/api/quadras');

        expect(response.status).toBe(500);
    });
});

describe('GET /api/quadras/:id', () => {
    test('deve retornar a quadra correspondente ao id', async () => {
        const quadra = {
            id: 1,
            name: 'Quadra 1',
            active: true
        };

        prismaMock.quadra.findUnique.mockResolvedValue(quadra);

        const response = await request(app)
            .get('/api/quadras/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(quadra);

        expect(
            prismaMock.quadra.findUnique
        ).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });
    });

    test('deve retornar 404 quando a quadra não existir', async () => {
        prismaMock.quadra.findUnique.mockResolvedValue(null);

        const response = await request(app)
            .get('/api/quadras/999');

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            message: 'Quadra não encontrada.'
        });
    });
});

describe('POST /api/quadras', () => {
    test('deve cadastrar uma quadra', async () => {
        const quadra = {
            id: 3,
            name: 'Quadra Nova',
            active: true
        };

        prismaMock.quadra.create.mockResolvedValue(quadra);

        const response = await request(app)
            .post('/api/quadras')
            .send({
                name: 'Quadra Nova'
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(quadra);

        expect(
            prismaMock.quadra.create
        ).toHaveBeenCalledWith({
            data: {
                name: 'Quadra Nova'
            }
        });
    });
});

describe('PUT /api/quadras/:id', () => {
    test('deve atualizar uma quadra', async () => {
        const quadra = {
            id: 1,
            name: 'Quadra Atualizada',
            active: true
        };

        prismaMock.quadra.update.mockResolvedValue(quadra);

        const response = await request(app)
            .put('/api/quadras/1')
            .send({
                name: 'Quadra Atualizada'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(quadra);

        expect(
            prismaMock.quadra.update
        ).toHaveBeenCalledWith({
            where: {
                id: 1
            },
            data: {
                name: 'Quadra Atualizada'
            }
        });
    });
});

describe('DELETE /api/quadras/:id', () => {
    test('deve deletar uma quadra', async () => {
        prismaMock.quadra.delete.mockResolvedValue({
            id: 1,
            name: 'Quadra 1',
            active: true
        });

        const response = await request(app)
            .delete('/api/quadras/1');

        expect(response.status).toBe(204);

        expect(
            prismaMock.quadra.delete
        ).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });
    });
});