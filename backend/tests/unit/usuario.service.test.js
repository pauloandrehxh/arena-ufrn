import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
} from '@jest/globals';

import { createUsuarioService } from '../../src/services/usuario.service.js';

const prismaMock = {
  usuario: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const usuarioService = createUsuarioService(prismaMock);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('UsuarioService', () => {
  describe('listarUsuarios', () => {
    test('deve retornar todos os usuários', async () => {
      const usuarios = [
        {
          id: 1,
          name: 'Paulo',
          email: 'paulo@email.com',
          registration: '202612345',
          active: true,
        },
        {
          id: 2,
          name: 'Maria',
          email: 'maria@email.com',
          registration: '202612346',
          active: true,
        },
      ];

      prismaMock.usuario.findMany.mockResolvedValue(usuarios);

      const resultado = await usuarioService.listarUsuarios();

      expect(resultado).toEqual(usuarios);
      expect(prismaMock.usuario.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('buscarUsuarioPorId', () => {
    test('deve retornar um usuário pelo id', async () => {
      const usuario = {
        id: 1,
        name: 'Paulo',
        email: 'paulo@email.com',
        registration: '202612345',
        active: true,
      };

      prismaMock.usuario.findUnique.mockResolvedValue(usuario);

      const resultado = await usuarioService.buscarUsuarioPorId(1);

      expect(resultado).toEqual(usuario);

      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    test('deve retornar null quando o usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      const resultado = await usuarioService.buscarUsuarioPorId(999);

      expect(resultado).toBeNull();

      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      });
    });
  });

  describe('criarUsuario', () => {
    test('deve criar um usuário', async () => {
      const dadosUsuario = {
        name: 'Paulo',
        email: 'paulo@email.com',
        registration: '202612345',
      };

      const usuarioCriado = {
        id: 1,
        ...dadosUsuario,
        active: true,
      };

      prismaMock.usuario.create.mockResolvedValue(usuarioCriado);

      const resultado = await usuarioService.criarUsuario(dadosUsuario);

      expect(resultado).toEqual(usuarioCriado);

      expect(prismaMock.usuario.create).toHaveBeenCalledWith({
        data: dadosUsuario,
      });
    });
  });

  describe('atualizarUsuario', () => {
    test('deve atualizar um usuário', async () => {
      const dadosAtualizados = {
        name: 'Paulo André',
      };

      const usuarioAtualizado = {
        id: 1,
        name: 'Paulo André',
        email: 'paulo@email.com',
        registration: '202612345',
        active: true,
      };

      prismaMock.usuario.update.mockResolvedValue(usuarioAtualizado);

      const resultado = await usuarioService.atualizarUsuario(
        1,
        dadosAtualizados
      );

      expect(resultado).toEqual(usuarioAtualizado);

      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: dadosAtualizados,
      });
    });
  });

  describe('deletarUsuario', () => {
    test('deve deletar um usuário', async () => {
      const usuario = {
        id: 1,
        name: 'Paulo',
        email: 'paulo@email.com',
        registration: '202612345',
        active: true,
      };

      prismaMock.usuario.delete.mockResolvedValue(usuario);

      const resultado = await usuarioService.deletarUsuario(1);

      expect(resultado).toEqual(usuario);

      expect(prismaMock.usuario.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });
    
  });
});