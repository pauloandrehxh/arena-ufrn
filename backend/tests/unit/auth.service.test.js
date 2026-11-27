import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { createAuthService } from '../../src/services/auth.service.js';
import { hashSenha } from '../../src/lib/password.js';
import {
    AuthConflictError,
    AuthUnauthorizedError,
    AuthValidationError,
} from '../../src/lib/auth.validation.js';

const prismaMock = {
    usuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};

const jwtMock = {
    assinarToken: jest.fn(),
    verificarToken: jest.fn(),
};

const authService = createAuthService(prismaMock, jwtMock);

beforeEach(() => {
    jest.resetAllMocks();
    jwtMock.assinarToken.mockResolvedValue('jwt-token-mock');
});

describe('AuthService', () => {
    describe('registrar', () => {
        test('cria aluno com senha hasheada e nunca retorna passwordHash', async () => {
            prismaMock.usuario.findUnique
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            prismaMock.usuario.create.mockImplementation(({ data }) => ({
                id: 10,
                ...data,
            }));

            const resultado = await authService.registrar({
                name: '  Ana Clara  ',
                email: 'ANA@UFRN.BR',
                registration: '202699999',
                password: 'SenhaSegura123',
            });

            expect(resultado.token).toBe('jwt-token-mock');
            expect(resultado.user).toEqual({
                id: 10,
                name: 'Ana Clara',
                email: 'ana@ufrn.br',
                registration: '202699999',
                role: 'ALUNO',
                active: true,
            });
            expect(resultado.user.passwordHash).toBeUndefined();

            const dadosSalvos = prismaMock.usuario.create.mock.calls[0][0].data;
            expect(dadosSalvos.passwordHash).toMatch(/^scrypt\$/);
            expect(dadosSalvos.passwordHash).not.toContain('SenhaSegura123');
        });

        test('rejeita e-mail ou matrícula duplicados com conflito', async () => {
            prismaMock.usuario.findUnique.mockResolvedValueOnce({ id: 1 });
            await expect(authService.registrar({
                name: 'Ana',
                email: 'ana@ufrn.br',
                registration: '2026001',
                password: 'password123',
            })).rejects.toBeInstanceOf(AuthConflictError);

            prismaMock.usuario.findUnique
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ id: 2 });
            await expect(authService.registrar({
                name: 'Ana',
                email: 'ana2@ufrn.br',
                registration: '2026001',
                password: 'password123',
            })).rejects.toBeInstanceOf(AuthConflictError);
        });

        test.each([
            { name: 'A', email: 'a@ufrn.br', registration: '2026', password: 'password' },
            { name: 'Ana', email: 'email-invalido', registration: '2026', password: 'password' },
            { name: 'Ana', email: 'a@ufrn.br', registration: '12', password: 'password' },
            { name: 'Ana', email: 'a@ufrn.br', registration: '2026', password: '123' },
        ])('rejeita entrada inválida %p', async (entrada) => {
            await expect(authService.registrar(entrada)).rejects.toBeInstanceOf(AuthValidationError);
            expect(prismaMock.usuario.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        test('autentica por e-mail ou matrícula com senha válida', async () => {
            const passwordHash = await hashSenha('Arena@123');
            const usuarioBanco = {
                id: 1,
                name: 'Paulo',
                email: 'paulo@ufrn.br',
                registration: '202612345',
                role: 'ALUNO',
                active: true,
                passwordHash,
            };

            prismaMock.usuario.findUnique.mockResolvedValue(usuarioBanco);

            const porEmail = await authService.login({
                email: 'PAULO@ufrn.br',
                password: 'Arena@123',
            });
            expect(porEmail.user.id).toBe(1);
            expect(porEmail.user.passwordHash).toBeUndefined();
            expect(porEmail.token).toBe('jwt-token-mock');

            const porMatricula = await authService.login({
                identifier: '202612345',
                password: 'Arena@123',
            });
            expect(porMatricula.user.registration).toBe('202612345');
        });

        test('rejeita senha incorreta, usuário inexistente ou inativo', async () => {
            const passwordHash = await hashSenha('Arena@123');

            prismaMock.usuario.findUnique.mockResolvedValueOnce(null);
            await expect(authService.login({ email: 'nao@existe.br', password: '123' }))
                .rejects.toBeInstanceOf(AuthUnauthorizedError);

            prismaMock.usuario.findUnique.mockResolvedValueOnce({
                id: 1, active: false, passwordHash,
            });
            await expect(authService.login({ email: 'inativo@ufrn.br', password: 'Arena@123' }))
                .rejects.toBeInstanceOf(AuthUnauthorizedError);

            prismaMock.usuario.findUnique.mockResolvedValueOnce({
                id: 1, active: true, passwordHash,
            });
            await expect(authService.login({ email: 'paulo@ufrn.br', password: 'errada' }))
                .rejects.toBeInstanceOf(AuthUnauthorizedError);
        });
    });
});
