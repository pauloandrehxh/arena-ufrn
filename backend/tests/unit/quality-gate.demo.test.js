import { describe, expect, test } from '@jest/globals';

describe('Demonstração do Quality Gate', () => {
  test('falha proposital para impedir o deploy', () => {
    expect('teste quebrado').toBe('valor esperado');
  });
});
