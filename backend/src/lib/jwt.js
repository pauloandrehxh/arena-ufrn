import { SignJWT, jwtVerify } from 'jose';

const FALLBACK_TEST_SECRET = 'arena-ufrn-test-secret-key-at-least-32-chars';

function obterChaveSecreta(secret) {
    const valor = secret || process.env.JWT_SECRET || (
        process.env.NODE_ENV === 'test' ? FALLBACK_TEST_SECRET : ''
    );

    if (!valor || valor.length < 16) {
        throw new Error('JWT_SECRET não configurado com tamanho mínimo seguro.');
    }

    return new TextEncoder().encode(valor);
}

export function createJwtService({ secret, expiresIn = '8h' } = {}) {
    async function assinarToken(usuario) {
        const chave = obterChaveSecreta(secret);

        return new SignJWT({
            role: usuario.role,
            email: usuario.email,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject(String(usuario.id))
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(chave);
    }

    async function verificarToken(token) {
        const chave = obterChaveSecreta(secret);
        const { payload } = await jwtVerify(token, chave, {
            algorithms: ['HS256'],
        });

        const userId = Number(payload.sub);

        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error('Token com identificador inválido.');
        }

        return {
            id: userId,
            role: payload.role,
            email: payload.email,
        };
    }

    return {
        assinarToken,
        verificarToken,
    };
}
