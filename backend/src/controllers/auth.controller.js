import {
    AuthConflictError,
    AuthUnauthorizedError,
    AuthValidationError,
} from '../lib/auth.validation.js';
import { AUTH_COOKIE_NAME } from '../middlewares/auth.middleware.js';

const OITO_HORAS_MS = 8 * 60 * 60 * 1000;

function opcoesCookie() {
    const producao = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        sameSite: 'lax',
        secure: producao,
        path: '/',
        maxAge: OITO_HORAS_MS,
    };
}

function responderErroAuth(res, error, mensagemPadrao) {
    if (error instanceof AuthValidationError) {
        return res.status(400).json({ message: error.message });
    }
    if (error instanceof AuthUnauthorizedError) {
        return res.status(401).json({ message: error.message });
    }
    if (error instanceof AuthConflictError) {
        return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: mensagemPadrao });
}

export function createAuthController(authService) {
    async function registrar(req, res) {
        try {
            const resultado = await authService.registrar(req.body);
            res.cookie(AUTH_COOKIE_NAME, resultado.token, opcoesCookie());
            return res.status(201).json(resultado);
        } catch (error) {
            return responderErroAuth(res, error, 'Erro ao cadastrar conta.');
        }
    }

    async function login(req, res) {
        try {
            const resultado = await authService.login(req.body);
            res.cookie(AUTH_COOKIE_NAME, resultado.token, opcoesCookie());
            return res.status(200).json(resultado);
        } catch (error) {
            return responderErroAuth(res, error, 'Erro ao autenticar usuário.');
        }
    }

    async function logout(req, res) {
        res.clearCookie(AUTH_COOKIE_NAME, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
        return res.status(204).send();
    }

    async function me(req, res) {
        return res.status(200).json({ user: req.usuario });
    }

    return {
        registrar,
        login,
        logout,
        me,
    };
}
