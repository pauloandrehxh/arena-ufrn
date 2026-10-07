import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import request from 'supertest';
import { criarBancoTeste } from '../helpers/banco-teste.js';

// QA separado do Jest: falhas de aceite são registradas e produzem exit code 1.
// QA_APP_PATH permite avaliar o createApp da branch do colega sem fazer merge.
const modulo = process.env.QA_APP_PATH
    ? pathToFileURL(process.env.QA_APP_PATH).href
    : new URL('../../src/app.js', import.meta.url).href;
const { createApp } = await import(modulo);
const banco = criarBancoTeste();
const prisma = banco.prisma;
const app = createApp(prisma);
const casos = [];

async function executar(id, criterio, descricao, cenario) {
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();
    const observado = {};
    try {
        await cenario(observado);
        casos.push({ id, criterio, descricao, resultado: 'Passou', observado });
    } catch (error) {
        casos.push({ id, criterio, descricao, resultado: 'Falhou', observado, erro: error.message });
    }
}

function registrar(observado, resposta) {
    observado.status = resposta.status;
    observado.body = resposta.body;
}

async function cadastrar() {
    return prisma.quadra.create({ data: { name: 'Quadra QA' } });
}

try {
    await executar('QA01', 'CA01/CA02', 'Cadastrar e consultar quadra válida', async (o) => {
        const resposta = await request(app).post('/api/quadras').send({ name: 'Quadra QA' });
        registrar(o, resposta);
        assert.equal(resposta.status, 201);
        assert.equal(resposta.body.active, true);
        assert.ok(Number.isInteger(resposta.body.id));
        const consulta = await request(app).get(`/api/quadras/${resposta.body.id}`);
        assert.equal(consulta.status, 200);
        assert.deepEqual(consulta.body, resposta.body);
        assert.equal(await prisma.quadra.count(), 1);
    });
    await executar('QA02', 'CA02', 'Listar catálogo vazio', async (o) => {
        const resposta = await request(app).get('/api/quadras');
        registrar(o, resposta);
        assert.equal(resposta.status, 200);
        assert.deepEqual(resposta.body, []);
    });
    await executar('QA03', 'CA02', 'Consultar ID inexistente', async (o) => {
        const resposta = await request(app).get('/api/quadras/2147483647');
        registrar(o, resposta);
        assert.equal(resposta.status, 404);
    });
    await executar('QA04', 'CA02', 'Consultar ID não numérico', async (o) => {
        const resposta = await request(app).get('/api/quadras/abc');
        registrar(o, resposta);
        assert.equal(resposta.status, 400);
    });
    for (const [id, name] of [['QA05', ''], ['QA06', '   '], ['QA07', 123], ['QA08', undefined]]) {
        await executar(id, 'CA01', `Rejeitar nome ${JSON.stringify(name) ?? 'ausente'}`, async (o) => {
            const resposta = await request(app).post('/api/quadras').send(name === undefined ? {} : { name });
            registrar(o, resposta);
            o.registros = await prisma.quadra.count();
            assert.equal(resposta.status, 400);
            assert.equal(o.registros, 0);
        });
    }
    await executar('QA09', 'CA03', 'Atualizar nome preservando ID e estado', async (o) => {
        const quadra = await cadastrar();
        const resposta = await request(app).put(`/api/quadras/${quadra.id}`).send({ name: 'Nome novo' });
        registrar(o, resposta);
        assert.equal(resposta.status, 200);
        assert.deepEqual(await prisma.quadra.findUnique({ where: { id: quadra.id } }), {
            ...quadra, name: 'Nome novo',
        });
    });
    await executar('QA10', 'CA03', 'Nome vazio não altera quadra', async (o) => {
        const quadra = await cadastrar();
        const resposta = await request(app).put(`/api/quadras/${quadra.id}`).send({ name: '' });
        registrar(o, resposta);
        o.persistido = await prisma.quadra.findUnique({ where: { id: quadra.id } });
        assert.equal(resposta.status, 400);
        assert.deepEqual(o.persistido, quadra);
    });
    await executar('QA11', 'CA04', 'Excluir quadra sem reservas', async (o) => {
        const quadra = await cadastrar();
        const resposta = await request(app).delete(`/api/quadras/${quadra.id}`);
        registrar(o, resposta);
        assert.equal(resposta.status, 204);
        assert.equal(await prisma.quadra.count(), 0);
    });
    await executar('QA12', 'CA04', 'Preservar quadra e reserva vinculada', async (o) => {
        const quadra = await cadastrar();
        const usuario = await prisma.usuario.create({
            data: { name: 'Aluno QA', email: 'qa@example.com', registration: 'QA01' },
        });
        const reserva = await prisma.reserva.create({ data: {
            quadraId: quadra.id, usuarioId: usuario.id,
            date: new Date('2099-10-10'), startTime: '14:00', endTime: '15:00',
        } });
        const resposta = await request(app).delete(`/api/quadras/${quadra.id}`);
        registrar(o, resposta);
        assert.ok(resposta.status >= 400 && resposta.status < 600);
        assert.deepEqual(await prisma.quadra.findUnique({ where: { id: quadra.id } }), quadra);
        assert.deepEqual(await prisma.reserva.findUnique({ where: { id: reserva.id } }), reserva);
    });
    await executar('QA13', 'CA05', 'Não expor detalhes em falha de dependência (injeção controlada)', async (o) => {
        const appComFalha = createApp({ quadra: {
            findMany: async () => { throw new Error('SEGREDO_QA_DEPENDENCIA'); },
        } });
        const resposta = await request(appComFalha).get('/api/quadras');
        registrar(o, resposta);
        assert.equal(resposta.status, 500);
        assert.ok(!JSON.stringify(resposta.body).includes('SEGREDO_QA_DEPENDENCIA'));
    });
    console.log(JSON.stringify({
        alvo: modulo,
        schema: 'Migrations atuais do projeto; não é o schema histórico da branch de setembro',
        passou: casos.filter((c) => c.resultado === 'Passou').length,
        falhou: casos.filter((c) => c.resultado === 'Falhou').length,
        casos,
    }, null, 2));
    process.exitCode = casos.some((c) => c.resultado === 'Falhou') ? 1 : 0;
} finally {
    await banco.fechar();
}
