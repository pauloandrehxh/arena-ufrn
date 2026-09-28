import express from 'express';
import request from 'supertest';

import {
    jest,
    describe,
    test,
    expect,
    beforeEach
} from '@jest/globals';

import { createUsuarioService } from '../../src/services/usuario.service.js';
import { createUsuarioController } from '../../src/controllers/usuario.controller.js';
import { createUsuarioRoutes } from '../../src/routes/usuario.routes.js';

const prismaMock = {
    usuario: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
};

const usuarioService = createUsuarioService(prismaMock);
const usuarioController = createUsuarioController(usuarioService);
const usuarioRoutes = createUsuarioRoutes(usuarioController);

const app = express();

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Integração - API de usuários', () => {
    test('deve criar um usuário através da API', async () => {
        const dadosUsuario = {
            name: 'Paulo André',
            email: 'paulo.integracao@email.com',
            registration: '202612345'
        };

        const usuarioCriado = {
            id: 1,
            ...dadosUsuario,
            active: true
        };

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        prismaMock.usuario.create
            .mockResolvedValue(usuarioCriado);

        const response = await request(app)
            .post('/api/usuarios')
            .send(dadosUsuario);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(usuarioCriado);

        expect(prismaMock.usuario.create)
            .toHaveBeenCalledWith({
                data: dadosUsuario
            });
    });
});