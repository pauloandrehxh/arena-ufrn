import express from 'express';
import request from 'supertest';

import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
} from '@jest/globals';

import { createQuadraService } from '../../src/services/quadra.service.js';
import { createQuadraController } from '../../src/controllers/quadra.controller.js';
import { createQuadraRoutes } from '../../src/routes/quadra.routes.js';

const prismaMock = {
  quadra: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const quadraService = createQuadraService(prismaMock);

const quadraController =
  createQuadraController(quadraService);

const quadraRoutes =
  createQuadraRoutes(quadraController);

const app = express();

app.use(express.json());
app.use('/api/quadras', quadraRoutes);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Integração - API de quadras', () => {
  test.each(['abc', '0', '-1', '1.5', '2147483648'])(
    'retorna 400 para ID inválido %s em consulta/alteração/exclusão', async (id) => {
      expect((await request(app).get(`/api/quadras/${id}`)).status).toBe(400);
      expect((await request(app).put(`/api/quadras/${id}`).send({ name: 'Quadra' })).status).toBe(400);
      expect((await request(app).delete(`/api/quadras/${id}`)).status).toBe(400);
      expect(prismaMock.quadra.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.quadra.update).not.toHaveBeenCalled();
      expect(prismaMock.quadra.delete).not.toHaveBeenCalled();
    }
  );

  test.each([{ name: '' }, { name: '   ' }, { name: 123 }, {}])(
    'retorna 400 e não persiste nome inválido %p', async (body) => {
      expect((await request(app).post('/api/quadras').send(body)).status).toBe(400);
      expect((await request(app).put('/api/quadras/1').send(body)).status).toBe(400);
      expect(prismaMock.quadra.create).not.toHaveBeenCalled();
      expect(prismaMock.quadra.update).not.toHaveBeenCalled();
    }
  );

  test.each([
    ['get', '/api/quadras', 'findMany'],
    ['get', '/api/quadras/1', 'findUnique'],
    ['post', '/api/quadras', 'create'],
    ['put', '/api/quadras/1', 'update'],
    ['delete', '/api/quadras/1', 'delete'],
  ])('retorna 500 genérico para falha em %s %s', async (method, path, dependencia) => {
    prismaMock.quadra[dependencia].mockRejectedValue(new Error('SEGREDO_DEPENDENCIA'));
    const response = await request(app)[method](path).send({ name: 'Quadra' });
    expect(response.status).toBe(500);
    expect(JSON.stringify(response.body)).not.toContain('SEGREDO_DEPENDENCIA');
  });

  describe('GET /api/quadras', () => {
    test('deve retornar todas as quadras', async () => {
      const quadras = [
        {
          id: 1,
          name: 'Quadra 1',
          active: true,
        },
        {
          id: 2,
          name: 'Quadra 2',
          active: true,
        },
      ];

      prismaMock.quadra.findMany.mockResolvedValue(quadras);

      const response = await request(app)
        .get('/api/quadras');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(quadras);

      expect(
        prismaMock.quadra.findMany
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/quadras/:id', () => {
    test('deve retornar uma quadra pelo id', async () => {
      const quadra = {
        id: 1,
        name: 'Quadra 1',
        active: true,
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
          id: 1,
        },
      });
    });

    test('deve retornar 404 quando a quadra não existir', async () => {
      prismaMock.quadra.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/quadras/999');

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: 'Quadra não encontrada.',
      });
    });
  });

  describe('POST /api/quadras', () => {
    test('deve criar uma nova quadra', async () => {
      const quadraCriada = {
        id: 3,
        name: 'Quadra Nova',
        active: true,
      };

      prismaMock.quadra.create.mockResolvedValue(
        quadraCriada
      );

      const response = await request(app)
        .post('/api/quadras')
        .send({
          name: 'Quadra Nova',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(quadraCriada);

      expect(
        prismaMock.quadra.create
      ).toHaveBeenCalledWith({
        data: {
          name: 'Quadra Nova',
        },
      });
    });
  });

  describe('PUT /api/quadras/:id', () => {
    test('deve atualizar uma quadra', async () => {
      const quadraAtualizada = {
        id: 1,
        name: 'Quadra Atualizada',
        active: true,
      };

      prismaMock.quadra.update.mockResolvedValue(
        quadraAtualizada
      );

      const response = await request(app)
        .put('/api/quadras/1')
        .send({
          name: 'Quadra Atualizada',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(quadraAtualizada);

      expect(
        prismaMock.quadra.update
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: 'Quadra Atualizada',
        },
      });
    });
  });

  describe('DELETE /api/quadras/:id', () => {
    test('deve deletar uma quadra', async () => {
      const quadra = {
        id: 1,
        name: 'Quadra 1',
        active: true,
      };

      prismaMock.quadra.delete.mockResolvedValue(quadra);

      const response = await request(app)
        .delete('/api/quadras/1');

      expect(response.status).toBe(204);

      expect(
        prismaMock.quadra.delete
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });
  });
});
