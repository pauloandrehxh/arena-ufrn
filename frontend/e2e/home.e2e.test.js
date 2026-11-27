import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Builder, By, until } from 'selenium-webdriver';
import firefox, { ServiceBuilder } from 'selenium-webdriver/firefox.js';

const BASE_URL =
    process.env.BASE_URL || 'http://localhost:5173';

async function abrirNavegador() {
    const options = new firefox.Options();

    if (process.env.FIREFOX_BINARY) {
        options.setBinary(process.env.FIREFOX_BINARY);
    }

    if (process.env.HEADLESS === 'true' || process.env.CI === 'true') {
        options.addArguments('-headless');
        options.windowSize({ width: 1365, height: 900 });
    }

    const builder = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options);

    if (process.env.GECKODRIVER_PATH) {
        builder.setFirefoxService(new ServiceBuilder(process.env.GECKODRIVER_PATH));
    }

    return builder.build();
}

// TESTE 1: Visualizar as quadras
test('Deve acessar a seção de quadras e visualizar o catálogo', async (t) => {
    const driver = await abrirNavegador();

    t.after(async () => {
        await driver.quit();
    });

    await driver.manage().window().setRect({
        width: 1365,
        height: 900,
    });

    await driver.get(BASE_URL);

    await driver.wait(until.elementLocated(By.css('h1')), 10000);

    const titulo = await driver.findElement(By.css('h1')).getText();
    assert.equal(titulo, 'Reserve sua Quadra de Areia');

    await driver.findElement(By.css('a[href="#quadras"]')).click();

    await driver.wait(until.elementLocated(By.css('#quadras h2')), 10000);

    const tituloQuadras = await driver.findElement(By.css('#quadras h2')).getText();
    assert.equal(tituloQuadras, 'Quadras Disponíveis');

    await driver.wait(async () => {
        const cards = await driver.findElements(By.css('#quadras h3'));
        return cards.length > 0;
    }, 15000);

    const quadras = await driver.findElements(By.css('#quadras h3'));
    assert.ok(
        quadras.length > 0,
        'O catálogo deveria apresentar pelo menos uma quadra'
    );
});

// TESTE 2: Consultar como funciona
test('Deve apresentar as etapas de funcionamento do sistema', async (t) => {
    const driver = await abrirNavegador();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(BASE_URL);

    await driver.wait(until.elementLocated(By.css('h1')), 10000);

    await driver.findElement(By.css('a[href="#como-funciona"]')).click();

    await driver.wait(until.elementLocated(By.css('#como-funciona h2')), 10000);

    const titulo = await driver.findElement(By.css('#como-funciona h2')).getText();
    assert.equal(titulo, 'Como Funciona?');

    const etapas = await driver.findElements(By.css('#como-funciona h3'));
    const textos = await Promise.all(etapas.map((etapa) => etapa.getText()));

    assert.deepEqual(textos, [
        'Escolha a Quadra',
        'Selecione o Horário',
        'Confirme & Jogue',
    ]);
});

// TESTE 3: Comportamento dos botões das quadras e navegação para horários
test('Deve respeitar o status de disponibilidade das quadras e navegar para horários', async (t) => {
    const driver = await abrirNavegador();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(BASE_URL);

    await driver.wait(until.elementLocated(By.css('#quadras h2')), 10000);

    await driver.wait(async () => {
        const carregando = await driver.findElements(
            By.xpath("//section[@id='quadras']//p[contains(., 'Carregando quadras')]")
        );
        const cards = await driver.findElements(By.css('#quadras h3'));
        return carregando.length === 0 && cards.length > 0;
    }, 15000);

    const disponiveis = await driver.findElements(
        By.xpath("//section[@id='quadras']//button[contains(., 'Ver Horários')]")
    );

    const indisponiveis = await driver.findElements(
        By.xpath("//section[@id='quadras']//button[contains(., 'Indisponível')]")
    );

    assert.ok(
        disponiveis.length + indisponiveis.length > 0,
        'Deveria existir pelo menos uma quadra com botão de status'
    );

    if (disponiveis.length > 0) {
        await disponiveis[0].click();
        await driver.wait(until.urlContains('/quadras/'), 10000);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
    }

    if (indisponiveis.length > 0) {
        assert.equal(await indisponiveis[0].isEnabled(), false);
    }
});

// TESTE 4: Proteção de rota restrita (/admin)
test('Deve redirecionar visitante não autenticado ao acessar /admin', async (t) => {
    const driver = await abrirNavegador();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/admin`);

    await driver.wait(until.urlContains('/login'), 10000);

    const urlAtual = await driver.getCurrentUrl();
    assert.ok(urlAtual.includes('/login'), 'Deveria redirecionar para /login');
});

// TESTE 5: Autenticação como Gestor e acesso ao Painel Administrativo
test('Deve autenticar gestor e exibir o Painel Administrativo restrito', async (t) => {
    const driver = await abrirNavegador();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/login`);

    const campoUsuario = await driver.wait(
        until.elementLocated(By.id('login-identifier')),
        10000
    );
    await campoUsuario.sendKeys(process.env.E2E_ADMIN_EMAIL || 'gestor@ufrn.br');

    const campoSenha = await driver.findElement(By.id('login-password'));
    await campoSenha.sendKeys(process.env.E2E_ADMIN_PASSWORD || 'Arena@123');

    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/admin'), 10000);
    await driver.wait(until.elementLocated(By.css('h1')), 10000);

    const tituloAdmin = await driver.findElement(By.css('h1')).getText();
    assert.equal(tituloAdmin, 'Painel Administrativo');
});
