// QA independente da US04: executar contra o app da revisão do PR de Luis.
// QA_APP_PATH=/tmp/opencode/arena-ufrn-t3-qa-16/backend/src/app.js node tests/acceptance/disponibilidade.qa.js
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import request from 'supertest';
import { criarBancoTeste } from '../helpers/banco-teste.js';

if (!process.env.QA_APP_PATH) {
    throw new Error('Informe QA_APP_PATH com o caminho absoluto do app do PR avaliado.');
}

const { createApp } = await import(pathToFileURL(process.env.QA_APP_PATH).href);
const banco = criarBancoTeste();
const { prisma } = banco;
const app = createApp(prisma, { agora: () => new Date('2099-10-01T12:00:00Z') });
const resultados = [];
let usuario;
let quadra;

async function limpar() {
    await prisma.reserva.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.quadra.deleteMany();
    usuario = await prisma.usuario.create({ data: {
        name: 'Usuário QA sintético', email: 'qa-us04@example.test', registration: 'QA-US04',
    } });
    quadra = await prisma.quadra.create({ data: { name: 'Quadra QA sintética' } });
}

async function reservar(overrides = {}) {
    return prisma.reserva.create({ data: {
        usuarioId: usuario.id, quadraId: quadra.id, date: new Date('2099-10-10'),
        startTime: '14:00', endTime: '15:00', status: 'ATIVA', ...overrides,
    } });
}

function consultar(quadraId = quadra.id, date = '2099-10-10') {
    return request(app).get('/api/quadras/disponibilidade').query({ quadraId, date });
}

async function caso(id, descricao, executar, { isolar = true } = {}) {
    try {
        if (isolar) await limpar();
        const observado = await executar();
        resultados.push({ id, resultado: 'Passou', descricao, observado });
    } catch (error) {
        resultados.push({ id, resultado: 'Falhou', descricao, observado: error.message });
    }
}

try {
    await caso('I2-CT09', 'ATIVA ocupa somente o intervalo reservado', async () => {
        await reservar();
        const r = await consultar();
        assert.equal(r.status, 200);
        assert.deepEqual(r.body.ocupacoes, [{ startTime: '14:00', endTime: '15:00', status: 'ATIVA' }]);
        assert(!r.body.disponiveis.some((s) => s.startTime === '14:00'));
        assert(r.body.disponiveis.some((s) => s.startTime === '15:00' && s.endTime === '16:00'));
        return { http: r.status, ocupacoes: r.body.ocupacoes, slots: r.body.disponiveis.length };
    });

    await caso('I2-CT10', 'PATCH real cancela e libera intervalo sem apagar histórico', async () => {
        const original = await reservar();
        const antes = await consultar();
        const cancelamento = await request(app).patch(`/api/reservas/${original.id}/cancelamento`);
        const depois = await consultar();
        const persistida = await prisma.reserva.findUnique({ where: { id: original.id } });
        assert.equal(antes.status, 200);
        assert.equal(cancelamento.status, 200);
        assert.equal(depois.status, 200);
        assert.equal(persistida.status, 'CANCELADA');
        assert.equal(depois.body.ocupacoes.length, 0);
        assert(depois.body.disponiveis.some((s) => s.startTime === '14:00' && s.endTime === '15:00'));
        return { antes: antes.body.ocupacoes.length, cancelamento: cancelamento.status,
            depois: depois.body.ocupacoes.length, statusPersistido: persistida.status };
    });

    await caso('I2-CT11', 'intervalos contíguos são livres', async () => {
        await reservar();
        const r = await consultar();
        assert.equal(r.status, 200);
        for (const [startTime, endTime] of [['13:00', '14:00'], ['15:00', '16:00']]) {
            assert(r.body.disponiveis.some((s) => s.startTime === startTime && s.endTime === endTime));
        }
        return { http: r.status, contiguos: ['13:00–14:00', '15:00–16:00'] };
    });

    await caso('I2-CT12', 'quadra inativa não oferece horários', async () => {
        await prisma.quadra.update({ where: { id: quadra.id }, data: { active: false } });
        const r = await consultar();
        assert.equal(r.status, 409);
        assert.equal(r.body.erro, 'Quadra indisponível.');
        assert.equal(await prisma.reserva.count(), 0);
        return { http: r.status, erro: r.body.erro };
    });

    await caso('I2-CT13', 'inexistente 404; ID e data inválidos 400', async () => {
        const inexistente = await consultar(2147483647);
        const idInvalido = await consultar('abc');
        const dataInvalida = await consultar(quadra.id, '2099-02-30');
        assert.equal(inexistente.status, 404);
        assert.equal(idInvalido.status, 400);
        assert.equal(dataInvalida.status, 400);
        return { inexistente: inexistente.status, idInvalido: idInvalido.status,
            dataInvalida: dataInvalida.status };
    });

    await caso('I2-CT14', 'sem reservas, 14 slots na janela aprovada 08:00–22:00', async () => {
        const r = await consultar();
        assert.equal(r.status, 200);
        assert.equal(r.body.ocupacoes.length, 0);
        assert.equal(r.body.disponiveis.length, 14);
        assert.deepEqual(r.body.disponiveis[0], { startTime: '08:00', endTime: '09:00' });
        assert.deepEqual(r.body.disponiveis.at(-1), { startTime: '21:00', endTime: '22:00' });
        return { http: r.status, slots: r.body.disponiveis.length };
    });

    await caso('I2-CT15', 'quadra/data não vazam ocupações entre consultas', async () => {
        const outra = await prisma.quadra.create({ data: { name: 'Outra quadra QA' } });
        await reservar({ quadraId: outra.id });
        await reservar({ date: new Date('2099-10-11') });
        const atual = await consultar();
        const segunda = await consultar(outra.id);
        const amanha = await consultar(quadra.id, '2099-10-11');
        assert.equal(atual.status, 200);
        assert.equal(atual.body.ocupacoes.length, 0);
        assert.equal(segunda.body.ocupacoes.length, 1);
        assert.equal(amanha.body.ocupacoes.length, 1);
        return { quadraAtual: atual.body.ocupacoes.length, outraQuadra: segunda.body.ocupacoes.length,
            outroDia: amanha.body.ocupacoes.length };
    });

    await caso('I2-CT16', 'limites 08:00–22:00 e duração 60 min aprovados', async () => {
        const r = await consultar();
        assert.equal(r.status, 200);
        assert.deepEqual(r.body.horarioFuncionamento,
            { inicio: '08:00', fim: '22:00', duracaoMinutos: 60 });
        assert.equal(r.body.disponiveis.length, 14);
        assert(r.body.disponiveis.every((s, i) =>
            s.startTime === `${String(i + 8).padStart(2, '0')}:00` &&
            s.endTime === `${String(i + 9).padStart(2, '0')}:00`));
        return { http: r.status, primeiro: r.body.disponiveis[0], ultimo: r.body.disponiveis.at(-1) };
    });

    await caso('QA09', 'falha interna não pode virar 400 nem vazar mensagem da dependência', async () => {
        const appFalha = createApp({ quadra: {
            findUnique: async () => { throw new Error('SEGREDO_QA_US04'); },
        } });
        const r = await request(appFalha).get('/api/quadras/disponibilidade')
            .query({ quadraId: 1, date: '2099-10-10' });
        assert.equal(r.status, 500, `HTTP ${r.status}; corpo ${JSON.stringify(r.body)}`);
        assert(!JSON.stringify(r.body).includes('SEGREDO_QA_US04'));
        return { http: r.status, body: r.body };
    }, { isolar: false });
} finally {
    await banco.fechar();
}

console.log(JSON.stringify(resultados, null, 2));
const aprovados = resultados.filter((r) => r.resultado === 'Passou').length;
const falhos = resultados.length - aprovados;
console.log(`QA US04: ${aprovados} Passou / ${falhos} Falhou`);
if (falhos) process.exitCode = 1;
