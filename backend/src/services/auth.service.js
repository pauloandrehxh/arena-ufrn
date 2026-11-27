import { hashSenha, verificarSenha } from '../lib/password.js';
import {
    AuthConflictError,
    AuthUnauthorizedError,
    validarDadosLogin,
    validarDadosRegistro,
} from '../lib/auth.validation.js';
import { sanitizarUsuario } from '../lib/usuario.select.js';

export function createAuthService(prisma, jwtService) {
    async function registrar(dados) {
        const { name, email, registration, password } = validarDadosRegistro(dados ?? {});

        const existenteEmail = await prisma.usuario.findUnique({
            where: { email },
        });
        if (existenteEmail) {
            throw new AuthConflictError('E-mail já cadastrado.');
        }

        const existenteMatricula = await prisma.usuario.findUnique({
            where: { registration },
        });
        if (existenteMatricula) {
            throw new AuthConflictError('Matrícula já cadastrada.');
        }

        const passwordHash = await hashSenha(password);

        const usuario = await prisma.usuario.create({
            data: {
                name,
                email,
                registration,
                passwordHash,
                role: 'ALUNO',
                active: true,
            },
        });

        const usuarioPublico = sanitizarUsuario(usuario);
        const token = await jwtService.assinarToken(usuarioPublico);

        return {
            user: usuarioPublico,
            token,
        };
    }

    async function login(dados) {
        const { identificador, password } = validarDadosLogin(dados ?? {});

        const ehEmail = identificador.includes('@');
        const usuario = ehEmail
            ? await prisma.usuario.findUnique({
                where: { email: identificador.toLowerCase() },
            })
            : await prisma.usuario.findUnique({
                where: { registration: identificador },
            });

        if (!usuario || !usuario.active) {
            throw new AuthUnauthorizedError('Credenciais inválidas.');
        }

        const senhaValida = await verificarSenha(password, usuario.passwordHash);
        if (!senhaValida) {
            throw new AuthUnauthorizedError('Credenciais inválidas.');
        }

        const usuarioPublico = sanitizarUsuario(usuario);
        const token = await jwtService.assinarToken(usuarioPublico);

        return {
            user: usuarioPublico,
            token,
        };
    }

    return {
        registrar,
        login,
    };
}
