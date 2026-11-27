import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

export async function hashSenha(senha) {
    if (typeof senha !== 'string' || senha.length === 0) {
        throw new Error('Senha inválida para hash.');
    }

    const salt = randomBytes(SALT_BYTES).toString('hex');
    const derivedKey = await scryptAsync(senha, salt, KEY_LENGTH, SCRYPT_PARAMS);

    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

export async function verificarSenha(senha, hashArmazenado) {
    if (typeof senha !== 'string' || typeof hashArmazenado !== 'string') {
        return false;
    }

    const partes = hashArmazenado.split('$');
    if (partes.length !== 3 || partes[0] !== 'scrypt') {
        return false;
    }

    const [, salt, hashHex] = partes;
    if (!salt || !hashHex) {
        return false;
    }

    const esperado = Buffer.from(hashHex, 'hex');
    const calculado = await scryptAsync(senha, salt, esperado.length, SCRYPT_PARAMS);

    if (esperado.length !== calculado.length) {
        return false;
    }

    return timingSafeEqual(esperado, calculado);
}
