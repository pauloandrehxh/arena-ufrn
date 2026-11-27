import { describe, test, expect } from '@jest/globals';
import { hashSenha, verificarSenha } from '../../src/lib/password.js';

describe('password.js - hash e verificação com scrypt', () => {
    test('gera hash com salt aleatório e valida senha correta', async () => {
        const hash1 = await hashSenha('Arena@123');
        const hash2 = await hashSenha('Arena@123');

        expect(hash1).toMatch(/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/);
        expect(hash1).not.toBe(hash2);
        expect(await verificarSenha('Arena@123', hash1)).toBe(true);
        expect(await verificarSenha('SenhaErrada', hash1)).toBe(false);
    });

    test('rejeita senha vazia ao gerar hash', async () => {
        await expect(hashSenha('')).rejects.toThrow('Senha inválida');
        await expect(hashSenha(null)).rejects.toThrow('Senha inválida');
    });

    test('retorna false para hashes malformados ou tipos inválidos', async () => {
        expect(await verificarSenha('Arena@123', 'formato-invalido')).toBe(false);
        expect(await verificarSenha('Arena@123', 'bcrypt$abc$def')).toBe(false);
        expect(await verificarSenha(null, 'scrypt$aa$bb')).toBe(false);
        expect(await verificarSenha('Arena@123', null)).toBe(false);
    });
});
