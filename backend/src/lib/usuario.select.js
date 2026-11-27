export const USUARIO_PUBLICO_SELECT = {
    id: true,
    name: true,
    email: true,
    registration: true,
    role: true,
    active: true,
    createdAt: true,
    updatedAt: true,
};

export function sanitizarUsuario(usuario) {
    if (!usuario) {
        return null;
    }

    const dadosPublicos = { ...usuario };
    delete dadosPublicos.passwordHash;
    return dadosPublicos;
}
