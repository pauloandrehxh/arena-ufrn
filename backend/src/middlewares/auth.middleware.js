import { sanitizarUsuario } from '../lib/usuario.select.js';

export const AUTH_COOKIE_NAME = 'arena_token';

export function parseCookies(cookieHeader) {
    if (typeof cookieHeader !== 'string' || cookieHeader.trim() === '') {
        return {};
    }

    const cookies = {};
    for (const par of cookieHeader.split(';')) {
        const indice = par.indexOf('=');
        if (indice === -1) continue;
        const chave = par.slice(0, indice).trim();
        const valor = par.slice(indice + 1).trim();
        if (chave) {
            cookies[chave] = decodeURIComponent(valor);
        }
    }
    return cookies;
}

export function extrairToken(req) {
    const cookies = parseCookies(req.headers?.cookie);
    if (cookies[AUTH_COOKIE_NAME]) {
        return cookies[AUTH_COOKIE_NAME];
    }

    const authHeader = req.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7).trim();
        if (token) {
            return token;
        }
    }

    return null;
}

export function requireRole(...papeisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                message: 'Autenticação necessária.',
            });
        }

        if (!papeisPermitidos.includes(req.usuario.role)) {
            return res.status(403).json({
                message: 'Acesso restrito. Você não tem permissão para esta operação.',
            });
        }

        return next();
    };
}

export function createAuthMiddlewares(prisma, jwtService) {
    async function requireAuth(req, res, next) {
        const token = extrairToken(req);

        if (!token) {
            return res.status(401).json({
                message: 'Autenticação necessária.',
            });
        }

        try {
            const payload = await jwtService.verificarToken(token);
            const usuario = await prisma.usuario.findUnique({
                where: { id: payload.id },
            });

            if (!usuario?.active) {
                return res.status(401).json({
                    message: 'Sessão inválida ou usuário inativo.',
                });
            }

            req.usuario = sanitizarUsuario(usuario);
            return next();
        } catch {
            return res.status(401).json({
                message: 'Sessão inválida ou expirada.',
            });
        }
    }

    return {
        requireAuth,
        requireRole,
    };
}
