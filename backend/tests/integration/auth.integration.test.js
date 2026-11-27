import request from 'supertest';
import { describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { hashSenha } from '../../src/lib/password.js';
import { criarBancoTeste } from '../helpers/banco-teste.js';

let banco;
let prisma;
let app;
let gestor;
let quadra;

beforeAll(async () => {
    banco = await criarBancoTeste();
    prisma = banco.prisma;
    app = createApp(prisma, {
        agora: () => new Date('2099-10-01T12:00:00Z'),
    });
});

beforeEach(async () => {
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();

    const hashGestor = await hashSenha('Gestor@123');
    gestor = await prisma.usuario.create({
        data: {
            name: 'Gestor UFRN',
            email: 'gestor@ufrn.br',
            registration: 'GESTOR99',
            passwordHash: hashGestor,
            role: 'GESTOR',
            active: true,
        },
    });

    quadra = await prisma.quadra.create({
        data: {
            name: 'Quadra Principal',
            sport: 'Vôlei de Praia',
            description: 'Quadra com iluminação noturna.',
            active: true,
        },
    });
});

afterAll(async () => {
    if (banco) await banco.fechar();
});

async function registrarAluno(overrides = {}) {
    const payload = {
        name: 'Aluno Teste',
        email: 'aluno@ufrn.br',
        registration: '2026001',
        password: 'Password123',
        ...overrides,
    };
    const res = await request(app).post('/api/auth/register').send(payload);
    return res;
}

async function loginGestor() {
    const res = await request(app).post('/api/auth/login').send({
        email: gestor.email,
        password: 'Gestor@123',
    });
    return res;
}

describe('US05/US06/US07/US08/US12 - Autenticação e Controle de Acesso no PostgreSQL', () => {
    test('registra aluno, define cookie HttpOnly, valida /me e encerra sessão no logout', async () => {
        const reg = await registrarAluno();
        expect(reg.status).toBe(201);
        expect(reg.body.user.role).toBe('ALUNO');
        expect(reg.body.user.passwordHash).toBeUndefined();
        expect(reg.headers['set-cookie']?.[0]).toContain('arena_token=');
        expect(reg.headers['set-cookie']?.[0]).toContain('HttpOnly');

        const cookie = reg.headers['set-cookie'][0];
        const me = await request(app).get('/api/auth/me').set('Cookie', cookie);
        expect(me.status).toBe(200);
        expect(me.body.user.email).toBe('aluno@ufrn.br');
        expect(me.body.user.passwordHash).toBeUndefined();

        const logout = await request(app).post('/api/auth/logout').set('Cookie', cookie);
        expect(logout.status).toBe(204);
        expect(logout.headers['set-cookie']?.[0]).toContain('arena_token=;');
    });

    test('login aceita matrícula ou e-mail e rejeita credenciais inválidas ou inativos', async () => {
        await registrarAluno();

        const okMatricula = await request(app).post('/api/auth/login').send({
            identifier: '2026001',
            password: 'Password123',
        });
        expect(okMatricula.status).toBe(200);
        expect(okMatricula.body.user.passwordHash).toBeUndefined();

        const senhaErrada = await request(app).post('/api/auth/login').send({
            email: 'aluno@ufrn.br',
            password: 'Errada',
        });
        expect(senhaErrada.status).toBe(401);

        await prisma.usuario.update({
            where: { email: 'aluno@ufrn.br' },
            data: { active: false },
        });
        const inativo = await request(app).post('/api/auth/login').send({
            email: 'aluno@ufrn.br',
            password: 'Password123',
        });
        expect(inativo.status).toBe(401);
    });

    test('bloqueia rotas restritas com 401 sem sessão e 403 para ALUNO em rotas de GESTOR', async () => {
        expect((await request(app).get('/api/auth/me')).status).toBe(401);
        expect((await request(app).get('/api/usuarios')).status).toBe(401);
        expect((await request(app).get('/api/reservas')).status).toBe(401);
        expect((await request(app).get('/api/reservas/minhas')).status).toBe(401);
        expect((await request(app).post('/api/quadras').send({ name: 'Q2' })).status).toBe(401);

        const alunoRes = await registrarAluno();
        const tokenAluno = alunoRes.body.token;

        expect((await request(app).get('/api/usuarios').set('Authorization', `Bearer ${tokenAluno}`)).status).toBe(403);
        expect((await request(app).get('/api/reservas').set('Authorization', `Bearer ${tokenAluno}`)).status).toBe(403);
        expect((await request(app).post('/api/quadras').set('Authorization', `Bearer ${tokenAluno}`).send({ name: 'Q2' })).status).toBe(403);
        expect((await request(app).patch(`/api/quadras/${quadra.id}/status`).set('Authorization', `Bearer ${tokenAluno}`).send({ active: false })).status).toBe(403);
    });

    test('aluno só cria, visualiza, reagenda e cancela suas próprias reservas (ignora usuarioId forjado)', async () => {
        const aluno1 = await registrarAluno({ email: 'a1@ufrn.br', registration: '2026011' });
        const aluno2 = await registrarAluno({ email: 'a2@ufrn.br', registration: '2026012' });

        // Aluno 1 tenta criar reserva passando usuarioId do Aluno 2 -> deve criar para si mesmo
        const criada = await request(app)
            .post('/api/reservas')
            .set('Authorization', `Bearer ${aluno1.body.token}`)
            .send({
                usuarioId: aluno2.body.user.id,
                quadraId: quadra.id,
                date: '2099-10-10',
                startTime: '14:00',
                endTime: '15:00',
            });
        expect(criada.status).toBe(201);
        expect(criada.body.usuarioId).toBe(aluno1.body.user.id);

        // Aluno 2 não pode ver, reagendar nem cancelar reserva do Aluno 1
        const verAlheia = await request(app)
            .get(`/api/reservas/${criada.body.id}`)
            .set('Authorization', `Bearer ${aluno2.body.token}`);
        expect(verAlheia.status).toBe(403);

        const editarAlheia = await request(app)
            .put(`/api/reservas/${criada.body.id}`)
            .set('Authorization', `Bearer ${aluno2.body.token}`)
            .send({ startTime: '15:00', endTime: '16:00' });
        expect(editarAlheia.status).toBe(403);

        const cancelarAlheia = await request(app)
            .patch(`/api/reservas/${criada.body.id}/cancelamento`)
            .set('Authorization', `Bearer ${aluno2.body.token}`);
        expect(cancelarAlheia.status).toBe(403);

        // Minhas reservas retorna apenas do titular
        const minhas1 = await request(app)
            .get('/api/reservas/minhas?status=ATIVA')
            .set('Authorization', `Bearer ${aluno1.body.token}`);
        expect(minhas1.status).toBe(200);
        expect(minhas1.body).toHaveLength(1);

        const minhas2 = await request(app)
            .get('/api/reservas/minhas')
            .set('Authorization', `Bearer ${aluno2.body.token}`);
        expect(minhas2.status).toBe(200);
        expect(minhas2.body).toHaveLength(0);
    });

    test('gestor gerencia quadras (manutenção + proteção de exclusão), usuários e agenda filtrada', async () => {
        const loginRes = await loginGestor();
        expect(loginRes.status).toBe(200);
        const tokenGestor = loginRes.body.token;

        const alunoRes = await registrarAluno();
        const reservaRes = await request(app)
            .post('/api/reservas')
            .set('Authorization', `Bearer ${alunoRes.body.token}`)
            .send({
                quadraId: quadra.id,
                date: '2099-10-12',
                startTime: '18:00',
                endTime: '19:00',
            });
        expect(reservaRes.status).toBe(201);

        // Não permite excluir quadra com reserva vinculada (409)
        const delComReserva = await request(app)
            .delete(`/api/quadras/${quadra.id}`)
            .set('Authorization', `Bearer ${tokenGestor}`);
        expect(delComReserva.status).toBe(409);

        // Gestor coloca quadra em manutenção (US08)
        const manutencao = await request(app)
            .patch(`/api/quadras/${quadra.id}/status`)
            .set('Authorization', `Bearer ${tokenGestor}`)
            .send({ active: false });
        expect(manutencao.status).toBe(200);
        expect(manutencao.body.active).toBe(false);

        // Gestor consulta agenda filtrada (US12) e lista usuários sem passwordHash (US06)
        const agenda = await request(app)
            .get(`/api/reservas?quadraId=${quadra.id}&status=ATIVA`)
            .set('Authorization', `Bearer ${tokenGestor}`);
        expect(agenda.status).toBe(200);
        expect(agenda.body).toHaveLength(1);
        expect(agenda.body[0].usuario.passwordHash).toBeUndefined();

        const usuarios = await request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${tokenGestor}`);
        expect(usuarios.status).toBe(200);
        expect(usuarios.body.every((u) => u.passwordHash === undefined)).toBe(true);

        // Gestor cancela reserva do aluno administrativamente
        const cancelAdm = await request(app)
            .patch(`/api/reservas/${reservaRes.body.id}/cancelamento`)
            .set('Authorization', `Bearer ${tokenGestor}`);
        expect(cancelAdm.status).toBe(200);
        expect(cancelAdm.body.status).toBe('CANCELADA');
    });
});
