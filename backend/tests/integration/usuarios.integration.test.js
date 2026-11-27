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
app.use((req, _res, next) => {
    const authUserId = req.headers['x-test-user-id'];
    if (authUserId) {
        req.usuario = { id: Number(authUserId), role: 'GESTOR' };
    }
    next();
});
app.use('/api/usuarios', usuarioRoutes);

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Integração - API de usuários', () => {
    test('deve listar usuários e tratar erro 500', async () => {
        const lista = [{ id: 1, name: 'Paulo', email: 'paulo@ufrn.br', registration: '2026001', active: true }];
        prismaMock.usuario.findMany.mockResolvedValueOnce(lista);

        const ok = await request(app).get('/api/usuarios');
        expect(ok.status).toBe(200);
        expect(ok.body).toEqual(lista);

        const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {});
        prismaMock.usuario.findMany.mockRejectedValueOnce(new Error('DB offline'));
        const err = await request(app).get('/api/usuarios');
        expect(err.status).toBe(500);
        spyErr.mockRestore();
    });

    test('deve buscar usuário por ID e validar 400, 404 e 500', async () => {
        const invalido = await request(app).get('/api/usuarios/abc');
        expect(invalido.status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(null);
        const naoEncontrado = await request(app).get('/api/usuarios/99');
        expect(naoEncontrado.status).toBe(404);

        const usuario = { id: 1, name: 'Paulo', email: 'paulo@ufrn.br', registration: '2026001', active: true };
        prismaMock.usuario.findUnique.mockResolvedValueOnce(usuario);
        const ok = await request(app).get('/api/usuarios/1');
        expect(ok.status).toBe(200);
        expect(ok.body).toEqual(usuario);

        const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {});
        prismaMock.usuario.findUnique.mockRejectedValueOnce(new Error('DB'));
        const err = await request(app).get('/api/usuarios/1');
        expect(err.status).toBe(500);
        spyErr.mockRestore();
    });

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
                data: expect.objectContaining({
                    ...dadosUsuario,
                    passwordHash: expect.stringMatching(/^scrypt\$/),
                }),
            });
    });

    test('deve validar criação de usuário (campos obrigatórios, role, duplicados, senha e erro 500)', async () => {
        expect((await request(app).post('/api/usuarios').send({ name: 'Sem email' })).status).toBe(400);

        expect((await request(app).post('/api/usuarios').send({
            name: 'Paulo', email: 'p@ufrn.br', registration: '123', role: 'ADMIN'
        })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce({ id: 2, email: 'p@ufrn.br' });
        expect((await request(app).post('/api/usuarios').send({
            name: 'Paulo', email: 'p@ufrn.br', registration: '123'
        })).status).toBe(409);

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ id: 2, registration: '123' });
        expect((await request(app).post('/api/usuarios').send({
            name: 'Paulo', email: 'p@ufrn.br', registration: '123'
        })).status).toBe(409);

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        expect((await request(app).post('/api/usuarios').send({
            name: 'Paulo', email: 'p@ufrn.br', registration: '123', password: '123'
        })).status).toBe(400);

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        prismaMock.usuario.create.mockResolvedValueOnce({
            id: 3, name: 'Gestor', email: 'g@ufrn.br', registration: '999', role: 'GESTOR', active: true
        });
        const okGestor = await request(app).post('/api/usuarios').send({
            name: 'Gestor', email: 'g@ufrn.br', registration: '999', password: 'Password123', role: 'GESTOR'
        });
        expect(okGestor.status).toBe(201);

        const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {});
        prismaMock.usuario.findUnique.mockRejectedValueOnce(new Error('DB'));
        expect((await request(app).post('/api/usuarios').send({
            name: 'Erro', email: 'e@ufrn.br', registration: '111'
        })).status).toBe(500);
        spyErr.mockRestore();
    });

    test('deve atualizar usuário e cobrir todas as validações e conflitos', async () => {
        expect((await request(app).put('/api/usuarios/0').send({ name: 'Novo' })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(null);
        expect((await request(app).put('/api/usuarios/99').send({ name: 'Novo' })).status).toBe(404);

        const existente = { id: 1, name: 'Paulo', email: 'p@ufrn.br', registration: '123', role: 'GESTOR', active: true };

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').send({ name: 'A' })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').send({ active: 'sim' })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').set('x-test-user-id', '1').send({ active: false })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').send({ role: 'SUPER' })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').set('x-test-user-id', '1').send({ role: 'ALUNO' })).status).toBe(400);

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(existente)
            .mockResolvedValueOnce({ id: 2, email: 'dup@ufrn.br' });
        expect((await request(app).put('/api/usuarios/1').send({ email: 'dup@ufrn.br' })).status).toBe(409);

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(existente)
            .mockResolvedValueOnce({ id: 2, registration: '999' });
        expect((await request(app).put('/api/usuarios/1').send({ registration: '999' })).status).toBe(409);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').send({ password: '123' })).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(existente);
        expect((await request(app).put('/api/usuarios/1').send({})).status).toBe(400);

        prismaMock.usuario.findUnique
            .mockResolvedValueOnce(existente)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        prismaMock.usuario.update.mockResolvedValueOnce({
            ...existente, name: 'Paulo Novo', email: 'novo@ufrn.br', registration: '456', active: true, role: 'GESTOR'
        });
        const ok = await request(app).put('/api/usuarios/1').send({
            name: 'Paulo Novo',
            email: 'novo@ufrn.br',
            registration: '456',
            active: true,
            role: 'GESTOR',
            password: 'NovaSenha123',
        });
        expect(ok.status).toBe(200);

        const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {});
        prismaMock.usuario.findUnique.mockRejectedValueOnce(new Error('DB'));
        expect((await request(app).put('/api/usuarios/1').send({ name: 'Teste' })).status).toBe(500);
        spyErr.mockRestore();
    });

    test('deve deletar usuário e tratar 400, 404, 409 (P2003) e 500', async () => {
        expect((await request(app).delete('/api/usuarios/-1')).status).toBe(400);

        expect((await request(app).delete('/api/usuarios/1').set('x-test-user-id', '1')).status).toBe(400);

        prismaMock.usuario.findUnique.mockResolvedValueOnce(null);
        expect((await request(app).delete('/api/usuarios/99')).status).toBe(404);

        prismaMock.usuario.findUnique.mockResolvedValueOnce({ id: 2, name: 'Aluno' });
        prismaMock.usuario.delete.mockResolvedValueOnce({ id: 2 });
        expect((await request(app).delete('/api/usuarios/2')).status).toBe(204);

        prismaMock.usuario.findUnique.mockResolvedValueOnce({ id: 2, name: 'Aluno' });
        prismaMock.usuario.delete.mockRejectedValueOnce({ code: 'P2003' });
        expect((await request(app).delete('/api/usuarios/2')).status).toBe(409);

        const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {});
        prismaMock.usuario.findUnique.mockRejectedValueOnce(new Error('DB'));
        expect((await request(app).delete('/api/usuarios/2')).status).toBe(500);
        spyErr.mockRestore();
    });
});