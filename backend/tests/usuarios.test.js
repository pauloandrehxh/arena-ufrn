import express from 'express';
import request from 'supertest';

import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from '@jest/globals';

import { createUsuarioService } from '../src/services/usuario.service.js';
import { createUsuarioController } from '../src/controllers/usuario.controller.js';
import { createUsuarioRoutes } from '../src/routes/usuario.routes.js';

const prismaMock = {
    usuario: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
};

const usuarioService =
    createUsuarioService(prismaMock);

const usuarioController =
    createUsuarioController(usuarioService);

const usuarioRoutes =
    createUsuarioRoutes(usuarioController);

const app = express();

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

beforeEach(() => {
    jest.resetAllMocks();
});

describe('GET /api/usuarios', () => {
    test('deve retornar todos os usuários', async () => {
        const usuarios = [
            {
                id: 1,
                name: 'Paulo',
                email: 'paulo@email.com',
                registration: '202612345',
                active: true
            },
            {
                id: 2,
                name: 'Maria',
                email: 'maria@email.com',
                registration: '202612346',
                active: true
            }
        ];

        prismaMock.usuario.findMany.mockResolvedValue(usuarios);

        const response = await request(app)
            .get('/api/usuarios');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(usuarios);

        expect(
            prismaMock.usuario.findMany
        ).toHaveBeenCalledTimes(1);
    });
});

describe('GET /api/usuarios/:id', () => {
    test('deve retornar um usuário pelo id', async () => {
        const usuario = {
            id: 1,
            name: 'Paulo',
            email: 'paulo@email.com',
            registration: '202612345',
            active: true
        };

        prismaMock.usuario.findUnique.mockResolvedValue(usuario);

        const response = await request(app)
            .get('/api/usuarios/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(usuario);

        expect(
            prismaMock.usuario.findUnique
        ).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });
    });

    test('deve retornar 404 quando o usuário não existir', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null);

        const response = await request(app)
            .get('/api/usuarios/999');

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            message: 'Usuário não encontrado.'
        });
    });

    test('deve retornar 400 quando o id for inválido', async () => {
        const response = await request(app)
            .get('/api/usuarios/abc');

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: 'ID inválido.'
        });

        expect(
            prismaMock.usuario.findUnique
        ).not.toHaveBeenCalled();
    });
});

describe('POST /api/usuarios', () => {
    test('deve criar um novo usuário', async () => {
        const novoUsuario = {
            name: 'Paulo',
            email: 'paulo@email.com',
            registration: '202612345'
        };

        const usuarioCriado = {
            id: 1,
            ...novoUsuario,
            active: true
        };

        // Primeira consulta: verifica e-mail
        // Segunda consulta: verifica matrícula
        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        prismaMock.usuario.create
            .mockResolvedValue(usuarioCriado);

        const response = await request(app)
            .post('/api/usuarios')
            .send(novoUsuario);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(usuarioCriado);

        expect(
            prismaMock.usuario.create
        ).toHaveBeenCalledWith({
            data: novoUsuario
        });
    });

    test('deve retornar 400 quando faltarem dados obrigatórios', async () => {
        const response = await request(app)
            .post('/api/usuarios')
            .send({
                name: 'Paulo'
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: 'Nome, e-mail e matrícula são obrigatórios.'
        });

        expect(
            prismaMock.usuario.create
        ).not.toHaveBeenCalled();
    });

    test('deve retornar 409 quando o e-mail já estiver cadastrado', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: 1,
            name: 'Outro usuário',
            email: 'paulo@email.com',
            registration: '202600001',
            active: true
        });

        const response = await request(app)
            .post('/api/usuarios')
            .send({
                name: 'Paulo',
                email: 'paulo@email.com',
                registration: '202612345'
            });

        expect(response.status).toBe(409);

        expect(response.body).toEqual({
            message: 'E-mail já cadastrado.'
        });

        expect(
            prismaMock.usuario.create
        ).not.toHaveBeenCalled();
    });

    test('deve retornar 409 quando a matrícula já estiver cadastrada', async () => {
        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
                id: 1,
                name: 'Outro usuário',
                email: 'outro@email.com',
                registration: '202612345',
                active: true
            });

        const response = await request(app)
            .post('/api/usuarios')
            .send({
                name: 'Paulo',
                email: 'paulo@email.com',
                registration: '202612345'
            });

        expect(response.status).toBe(409);

        expect(response.body).toEqual({
            message: 'Matrícula já cadastrada.'
        });

        expect(
            prismaMock.usuario.create
        ).not.toHaveBeenCalled();
    });
});

describe('PUT /api/usuarios/:id', () => {
    test('deve atualizar o nome do usuário', async () => {
        const usuarioExistente = {
            id: 1,
            name: 'Paulo',
            email: 'paulo@email.com',
            registration: '202612345',
            active: true
        };

        const usuarioAtualizado = {
            ...usuarioExistente,
            name: 'Paulo André'
        };

        prismaMock.usuario.findUnique
            .mockResolvedValue(usuarioExistente);

        prismaMock.usuario.update
            .mockResolvedValue(usuarioAtualizado);

        const response = await request(app)
            .put('/api/usuarios/1')
            .send({
                name: 'Paulo André'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(usuarioAtualizado);

        expect(
            prismaMock.usuario.update
        ).toHaveBeenCalledWith({
            where: {
                id: 1
            },
            data: {
                name: 'Paulo André'
            }
        });
    });

    test('deve retornar 404 ao atualizar usuário inexistente', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null);

        const response = await request(app)
            .put('/api/usuarios/999')
            .send({
                name: 'Novo nome'
            });

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            message: 'Usuário não encontrado.'
        });

        expect(
            prismaMock.usuario.update
        ).not.toHaveBeenCalled();
    });

    test('deve retornar 400 quando nenhum dado for enviado', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: 1,
            name: 'Paulo',
            email: 'paulo@email.com',
            registration: '202612345',
            active: true
        });

        const response = await request(app)
            .put('/api/usuarios/1')
            .send({});

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: 'Nenhum dado foi informado para atualização.'
        });

        expect(
            prismaMock.usuario.update
        ).not.toHaveBeenCalled();
    });
});

describe('DELETE /api/usuarios/:id', () => {
    test('deve deletar um usuário', async () => {
        const usuario = {
            id: 1,
            name: 'Paulo',
            email: 'paulo@email.com',
            registration: '202612345',
            active: true
        };

        prismaMock.usuario.findUnique.mockResolvedValue(usuario);

        prismaMock.usuario.delete.mockResolvedValue(usuario);

        const response = await request(app)
            .delete('/api/usuarios/1');

        expect(response.status).toBe(204);

        expect(
            prismaMock.usuario.delete
        ).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });
    });

    test('deve retornar 404 ao deletar usuário inexistente', async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null);

        const response = await request(app)
            .delete('/api/usuarios/999');

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            message: 'Usuário não encontrado.'
        });

        expect(
            prismaMock.usuario.delete
        ).not.toHaveBeenCalled();
    });
});