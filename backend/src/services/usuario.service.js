export function createUsuarioService(prisma) {
    async function listarUsuarios() {
        return prisma.usuario.findMany();
    }

    async function buscarUsuarioPorId(id) {
        return prisma.usuario.findUnique({
            where: {
                id
            }
        });
    }

    async function buscarUsuarioPorEmail(email) {
        return prisma.usuario.findUnique({
            where: {
                email
            }
        });
    }

    async function buscarUsuarioPorMatricula(registration) {
        return prisma.usuario.findUnique({
            where: {
                registration
            }
        });
    }

    async function criarUsuario(data) {
        return prisma.usuario.create({
            data
        });
    }

    async function atualizarUsuario(id, data) {
        return prisma.usuario.update({
            where: {
                id
            },
            data
        });
    }

    async function deletarUsuario(id) {
        return prisma.usuario.delete({
            where: {
                id
            }
        });
    }

    return {
        listarUsuarios,
        buscarUsuarioPorId,
        buscarUsuarioPorEmail,
        buscarUsuarioPorMatricula,
        criarUsuario,
        atualizarUsuario,
        deletarUsuario
    };
}