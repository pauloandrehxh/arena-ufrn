export function createUsuarioController(usuarioService) {
    async function listar(req, res) {
        try {
            const usuarios = await usuarioService.listarUsuarios();

            return res.json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);

            return res.status(500).json({
                message: 'Erro ao buscar usuários.'
            });
        }
    }

    async function buscarPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'ID inválido.'
                });
            }

            const usuario = await usuarioService.buscarUsuarioPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.'
                });
            }

            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao buscar usuário.'
            });
        }
    }

    async function criar(req, res) {
        try {
            const {
                name,
                email,
                registration
            } = req.body;

            if (!name || !email || !registration) {
                return res.status(400).json({
                    message: 'Nome, e-mail e matrícula são obrigatórios.'
                });
            }

            const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(email);

            if (usuarioComEmail) {
                return res.status(409).json({
                    message: 'E-mail já cadastrado.'
                });
            }

            const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(registration);

            if (usuarioComMatricula) {
                return res.status(409).json({
                    message: 'Matrícula já cadastrada.'
                });
            }

            const usuario = await usuarioService.criarUsuario({ name, email, registration });

            return res.status(201).json(usuario);

        } catch (error) {
            console.error('Erro ao criar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao criar usuário.'
            });
        }
    }

    async function atualizar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'ID inválido.'
                });
            }

            const usuarioExistente = await usuarioService.buscarUsuarioPorId(id);

            if (!usuarioExistente) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.'
                });
            }

            const {
                name,
                email,
                registration,
                active
            } = req.body;

            const dadosAtualizados = {};

            if (name !== undefined) {
                dadosAtualizados.name = name;
            }

            if (email !== undefined) {
                const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(email);

                if (usuarioComEmail && usuarioComEmail.id !== id) {
                    return res.status(409).json({
                        message: 'E-mail já cadastrado.'
                    });
                }

                dadosAtualizados.email = email;
            }

            if (registration !== undefined) {
                const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(registration);

                if (usuarioComMatricula && usuarioComMatricula.id !== id) {
                    return res.status(409).json({
                        message: 'Matrícula já cadastrada.'
                    });
                }

                dadosAtualizados.registration = registration;
            }

            if (active !== undefined) {
                dadosAtualizados.active = active;
            }

            if (Object.keys(dadosAtualizados).length === 0) {
                return res.status(400).json({
                    message:
                        'Nenhum dado foi informado para atualização.'
                });
            }

            const usuario = await usuarioService.atualizarUsuario(id, dadosAtualizados);

            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao atualizar usuário.'
            });
        }
    }

    async function deletar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'ID inválido.'
                });
            }

            const usuario = await usuarioService.buscarUsuarioPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.'
                });
            }

            await usuarioService.deletarUsuario(id);

            return res.status(204).send();

        } catch (error) {
            console.error('Erro ao deletar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao deletar usuário.'
            });
        }
    }

    return {
        listar,
        buscarPorId,
        criar,
        atualizar,
        deletar
    };
}