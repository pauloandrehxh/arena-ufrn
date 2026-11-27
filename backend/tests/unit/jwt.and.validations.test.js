import { describe, test, expect } from '@jest/globals';
import { createJwtService } from '../../src/lib/jwt.js';
import {
    QuadraValidationError,
    QuadraNotFoundError,
    QuadraConflictError,
    validarIdQuadra,
    validarNomeQuadra,
    validarTextoOpcional,
    validarStatusAtivo,
} from '../../src/lib/quadra.validation.js';

describe('JWT Service e validações de Quadra', () => {
    test('rejeita segredo curto ou inválido', async () => {
        const jwtService = createJwtService({ secret: 'curto' });
        await expect(
            jwtService.assinarToken({ id: 1, role: 'ALUNO', email: 'a@ufrn.br' })
        ).rejects.toThrow('JWT_SECRET');
    });

    test('rejeita token com subject não numérico', async () => {
        const jwtService = createJwtService({ secret: 'segredo-teste-com-mais-de-32-caracteres!' });
        const token = await jwtService.assinarToken({ id: 'invalido', role: 'ALUNO', email: 'a@ufrn.br' });
        await expect(jwtService.verificarToken(token)).rejects.toThrow('Token com identificador inválido.');
    });

    test('assina e verifica token válido', async () => {
        const jwtService = createJwtService({ secret: 'segredo-teste-com-mais-de-32-caracteres!' });
        const token = await jwtService.assinarToken({ id: 7, role: 'GESTOR', email: 'g@ufrn.br' });
        const payload = await jwtService.verificarToken(token);
        expect(payload).toEqual({ id: 7, role: 'GESTOR', email: 'g@ufrn.br' });
    });

    test('valida erros e helpers de quadra.validation', () => {
        const notFound = new QuadraNotFoundError();
        expect(notFound.name).toBe('QuadraNotFoundError');
        expect(notFound.message).toBe('Quadra não encontrada.');

        const conflict = new QuadraConflictError('Conflito');
        expect(conflict.name).toBe('QuadraConflictError');

        expect(() => validarIdQuadra(0)).toThrow(QuadraValidationError);
        expect(() => validarNomeQuadra('   ')).toThrow(QuadraValidationError);
        expect(() => validarTextoOpcional(123, 'Esporte')).toThrow(QuadraValidationError);
        expect(() => validarTextoOpcional('Vôlei', 'Esporte')).not.toThrow();
        expect(() => validarStatusAtivo('true')).toThrow(QuadraValidationError);
        expect(() => validarStatusAtivo(true)).not.toThrow();
    });
});
