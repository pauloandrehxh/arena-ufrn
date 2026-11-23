import request from 'supertest';
import { describe, expect, test } from '@jest/globals';

import { createApp } from '../../src/app.js';

const prismaMock = {};

const app = createApp(prismaMock);

describe('Integração - health check', () => {
  test('GET /health responde 200 com status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('arena-ufrn');
    expect(typeof response.body.timestamp).toBe('string');
  });
});
