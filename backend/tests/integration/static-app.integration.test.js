import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

import { createStaticApp } from '../../src/static-app.js';

let publicDir;
let app;

beforeAll(() => {
  publicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arena-static-'));
  fs.writeFileSync(path.join(publicDir, 'index.html'), '<h1>Arena UFRN</h1>');

  const apiApp = express();
  apiApp.get('/', (req, res) => res.json({ message: 'API' }));
  apiApp.get('/api/teste', (req, res) => res.json({ message: 'API de teste' }));
  apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));

  app = createStaticApp(apiApp, publicDir);
});

afterAll(() => {
  fs.rmSync(publicDir, { recursive: true, force: true });
});

describe('Integração - serving do frontend no mesmo container', () => {
  test('GET / entrega o index.html do React', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Arena UFRN');
  });

  test('GET /rota-do-frontend entrega o index.html', async () => {
    const response = await request(app).get('/rota-do-frontend');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Arena UFRN');
  });

  test('GET /api/teste continua na API', async () => {
    const response = await request(app).get('/api/teste');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('API de teste');
  });

  test('GET /health continua no health check', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
