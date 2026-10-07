import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
} from '@jest/globals';

import { createQuadraService } from '../../src/services/quadra.service.js';

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

beforeEach(() => {
  jest.resetAllMocks();
});

describe('QuadraService', () => {
  test.each(['', '   ', 123, null, undefined, [], {}])(
    'rejeita nome inválido %p antes de gravar', async (name) => {
      await expect(quadraService.criarQuadra(name)).rejects.toThrow('texto não vazio');
      await expect(quadraService.atualizarQuadra(1, name)).rejects.toThrow('texto não vazio');
      expect(prismaMock.quadra.create).not.toHaveBeenCalled();
      expect(prismaMock.quadra.update).not.toHaveBeenCalled();
    }
  );

  test.each([NaN, 0, -1, 1.5, '1', 2147483648])(
    'rejeita ID inválido %p antes de acessar o banco', async (id) => {
      await expect(quadraService.buscarQuadraPorId(id)).rejects.toThrow('inteiro positivo');
      await expect(quadraService.atualizarQuadra(id, 'Quadra')).rejects.toThrow('inteiro positivo');
      await expect(quadraService.deletarQuadra(id)).rejects.toThrow('inteiro positivo');
      expect(prismaMock.quadra.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.quadra.update).not.toHaveBeenCalled();
      expect(prismaMock.quadra.delete).not.toHaveBeenCalled();
    }
  );

  describe('listarQuadras', () => {
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

      const resultado = await quadraService.listarQuadras();

      expect(resultado).toEqual(quadras);

      expect(
        prismaMock.quadra.findMany
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('buscarQuadraPorId', () => {
    test('deve retornar uma quadra pelo id', async () => {
      const quadra = {
        id: 1,
        name: 'Quadra 1',
        active: true,
      };

      prismaMock.quadra.findUnique.mockResolvedValue(quadra);

      const resultado = await quadraService.buscarQuadraPorId(1);

      expect(resultado).toEqual(quadra);

      expect(
        prismaMock.quadra.findUnique
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    test('deve retornar null quando a quadra não existir', async () => {
      prismaMock.quadra.findUnique.mockResolvedValue(null);

      const resultado = await quadraService.buscarQuadraPorId(999);

      expect(resultado).toBeNull();

      expect(
        prismaMock.quadra.findUnique
      ).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      });
    });
  });

  describe('criarQuadra', () => {
    test('deve criar uma quadra', async () => {
      const quadraCriada = {
        id: 1,
        name: 'Quadra Nova',
        active: true,
      };

      prismaMock.quadra.create.mockResolvedValue(quadraCriada);

      const resultado = await quadraService.criarQuadra(
        'Quadra Nova'
      );

      expect(resultado).toEqual(quadraCriada);

      expect(
        prismaMock.quadra.create
      ).toHaveBeenCalledWith({
        data: {
          name: 'Quadra Nova',
        },
      });
    });
  });

  describe('atualizarQuadra', () => {
    test('deve atualizar uma quadra', async () => {
      const quadraAtualizada = {
        id: 1,
        name: 'Quadra Atualizada',
        active: true,
      };

      prismaMock.quadra.update.mockResolvedValue(
        quadraAtualizada
      );

      const resultado = await quadraService.atualizarQuadra(
        1,
        'Quadra Atualizada'
      );

      expect(resultado).toEqual(quadraAtualizada);

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

  describe('deletarQuadra', () => {
    test('deve deletar uma quadra', async () => {
      const quadra = {
        id: 1,
        name: 'Quadra 1',
        active: true,
      };

      prismaMock.quadra.delete.mockResolvedValue(quadra);

      const resultado = await quadraService.deletarQuadra(1);

      expect(resultado).toEqual(quadra);

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
