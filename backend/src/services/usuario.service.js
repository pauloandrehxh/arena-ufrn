import { USUARIO_PUBLICO_SELECT, sanitizarUsuario } from '../lib/usuario.select.js';

export function createUsuarioService(prisma) {
    async function listarUsuarios() {
        const usuarios = await prisma.usuario.findMany({
            select: USUARIO_PUBLICO_SELECT,
            orderBy: { id: 'asc' },
        });
        return usuarios.map(sanitizarUsuario);
    }

    async function buscarUsuarioPorId(id) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
        });
        return sanitizarUsuario(usuario);
    }

    async function buscarUsuarioPorEmail(email) {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });
        return sanitizarUsuario(usuario);
    }

    async function buscarUsuarioPorMatricula(registration) {
        const usuario = await prisma.usuario.findUnique({
            where: { registration },
        });
        return sanitizarUsuario(usuario);
    }

    async function criarUsuario(data) {
        const usuario = await prisma.usuario.create({
            data,
        });
        return sanitizarUsuario(usuario);
    }

    async function atualizarUsuario(id, data) {
        const usuario = await prisma.usuario.update({
            where: { id },
            data,
        });
        return sanitizarUsuario(usuario);
    }

    async function deletarUsuario(id) {
        const usuario = await prisma.usuario.delete({
            where: { id },
        });
        return sanitizarUsuario(usuario);
    }

    return {
        listarUsuarios,
        buscarUsuarioPorId,
        buscarUsuarioPorEmail,
        buscarUsuarioPorMatricula,
        criarUsuario,
        atualizarUsuario,
        deletarUsuario,
    };
}
