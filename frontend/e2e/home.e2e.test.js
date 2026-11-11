
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Builder, By, until } from 'selenium-webdriver';
import firefox, { ServiceBuilder } from 'selenium-webdriver/firefox.js';

const BASE_URL =
  process.env.BASE_URL || 'http://localhost:5173';

async function abrirNavegador() {
  const options = new firefox.Options();

  // Caminho do Mozilla Firefox
  options.setBinary(
    'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
  );

  // Executa sem abrir a janela, se solicitado
  if (process.env.HEADLESS === 'true') {
    options.addArguments('-headless');
  }

  // Caminho do GeckoDriver instalado
  const service = new ServiceBuilder(
    'C:\\Users\\luisf\\WebDriver\\geckodriver-v0.37.1-win64\\geckodriver.exe'
  );

  // Inicializa o Firefox com o GeckoDriver
  return new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .setFirefoxService(service)
    .build();
}

// TESTE 1: Visualizar as quadras
test('Deve acessar a seção de quadras e visualizar o catálogo', async (t) => {
  const driver = await abrirNavegador();

  t.after(async () => {
    await driver.quit();
  });

  await driver.manage().window().setRect({
    width: 1365,
    height: 900
  });

  await driver.get(BASE_URL);

  // Verifica se a página inicial foi carregada
  await driver.wait(
    until.elementLocated(By.css('h1')),
    10000
  );

  const titulo = await driver
    .findElement(By.css('h1'))
    .getText();

  assert.equal(titulo, 'Reserve sua Quadra de Areia');

  // Clica em Ver Quadras
  await driver
    .findElement(By.css('a[href="#quadras"]'))
    .click();

  // Aguarda a seção aparecer
  await driver.wait(
    until.elementLocated(By.css('#quadras h2')),
    10000
  );

  const tituloQuadras = await driver
    .findElement(By.css('#quadras h2'))
    .getText();

  assert.equal(tituloQuadras, 'Quadras Disponíveis');

  // Aguarda o carregamento do catálogo
  await driver.wait(async () => {
    const cards = await driver.findElements(
      By.css('#quadras h3')
    );

    return cards.length > 0;
  }, 15000);

  const quadras = await driver.findElements(
    By.css('#quadras h3')
  );

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

  await driver.wait(
    until.elementLocated(By.css('h1')),
    10000
  );

  // Clica no botão Como Funciona
  await driver
    .findElement(By.css('a[href="#como-funciona"]'))
    .click();

  await driver.wait(
    until.elementLocated(By.css('#como-funciona h2')),
    10000
  );

  const titulo = await driver
    .findElement(By.css('#como-funciona h2'))
    .getText();

  assert.equal(titulo, 'Como Funciona?');

  // Verifica as três etapas apresentadas
  const etapas = await driver.findElements(
    By.css('#como-funciona h3')
  );

  const textos = await Promise.all(
    etapas.map((etapa) => etapa.getText())
  );

  assert.deepEqual(textos, [
    'Escolha a Quadra',
    'Selecione o Horário',
    'Confirme & Jogue'
  ]);
});

// TESTE 3: Comportamento dos botões das quadras
test('Deve respeitar o status de disponibilidade das quadras', async (t) => {
  const driver = await abrirNavegador();

  t.after(async () => {
    await driver.quit();
  });

  await driver.get(BASE_URL);

  await driver.wait(
    until.elementLocated(By.css('#quadras h2')),
    10000
  );

  // Aguarda o carregamento das quadras
  await driver.wait(async () => {
    const carregando = await driver.findElements(
      By.xpath("//section[@id='quadras']//p[contains(., 'Carregando quadras')]")
    );

    const cards = await driver.findElements(
      By.css('#quadras h3')
    );

    return carregando.length === 0 && cards.length > 0;
  }, 15000);

  const disponiveis = await driver.findElements(
    By.xpath("//section[@id='quadras']//button[normalize-space()='Ver Horários']")
  );

  const indisponiveis = await driver.findElements(
    By.xpath("//section[@id='quadras']//button[normalize-space()='Indisponível']")
  );

  assert.ok(
    disponiveis.length + indisponiveis.length > 0,
    'Deveria existir pelo menos uma quadra com botão de status'
  );

  // Se existir quadra disponível, verifica sua mensagem
  if (disponiveis.length > 0) {
    const botao = disponiveis[0];

    const card = await botao.findElement(
      By.xpath("./ancestor::div[contains(@class, 'bg-white')][1]")
    );

    const nome = await card
      .findElement(By.css('h3'))
      .getText();

    await botao.click();

    const alerta = await driver.switchTo().alert();

    assert.equal(
      await alerta.getText(),
      `Reserva para ${nome} em breve!`
    );

    await alerta.accept();
  }

  // Se existir quadra indisponível, verifica se está desabilitada
  if (indisponiveis.length > 0) {
    assert.equal(
      await indisponiveis[0].isEnabled(),
      false
    );
  }
});
