import { hashSenha } from '../lib/password.js';

const PAPEIS_VALIDOS = new Set(['ALUNO', 'GESTOR']);

export function createUsuarioController(usuarioService) {
    async function listar(req, res) {
        try {
            const usuarios = await usuarioService.listarUsuarios();

            return res.json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);

            return res.status(500).json({
                message: 'Erro ao buscar usuários.',
            });
        }
    }

    async function buscarPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'ID inválido.',
                });
            }

            const usuario = await usuarioService.buscarUsuarioPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                });
            }

            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao buscar usuário.',
            });
        }
    }

    async function criar(req, res) {
        try {
            const {
                name,
                email,
                registration,
                password,
                role,
            } = req.body ?? {};

            if (!name || !email || !registration) {
                return res.status(400).json({
                    message: 'Nome, e-mail e matrícula são obrigatórios.',
                });
            }

            if (role !== undefined && !PAPEIS_VALIDOS.has(role)) {
                return res.status(400).json({
                    message: 'Papel inválido. Use ALUNO ou GESTOR.',
                });
            }

            const emailNormalizado = String(email).trim().toLowerCase();
            const matriculaNormalizada = String(registration).trim();

            const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(emailNormalizado);

            if (usuarioComEmail) {
                return res.status(409).json({
                    message: 'E-mail já cadastrado.',
                });
            }

            const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(matriculaNormalizada);

            if (usuarioComMatricula) {
                return res.status(409).json({
                    message: 'Matrícula já cadastrada.',
                });
            }

            const dados = {
                name: String(name).trim(),
                email: emailNormalizado,
                registration: matriculaNormalizada,
            };

            if (password !== undefined) {
                if (typeof password !== 'string' || password.length < 6) {
                    return res.status(400).json({
                        message: 'A senha deve ter ao menos 6 caracteres.',
                    });
                }
                dados.passwordHash = await hashSenha(password);
            } else {
                dados.passwordHash = await hashSenha('Arena@123');
            }

            if (role !== undefined) {
                dados.role = role;
            }

            const usuario = await usuarioService.criarUsuario(dados);

            return res.status(201).json(usuario);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao criar usuário.',
            });
        }
    }

    async function atualizar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'ID inválido.',
                });
            }

            const usuarioExistente = await usuarioService.buscarUsuarioPorId(id);

            if (!usuarioExistente) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                });
            }

            const {
                name,
                email,
                registration,
                active,
                role,
                password,
            } = req.body ?? {};

            const dadosAtualizados = {};

            if (name !== undefined) {
                if (typeof name !== 'string' || name.trim().length < 2) {
                    return res.status(400).json({
                        message: 'Nome deve ter ao menos 2 caracteres.',
                    });
                }
                dadosAtualizados.name = name.trim();
            }

            if (email !== undefined) {
                const emailNormalizado = String(email).trim().toLowerCase();
                const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(emailNormalizado);

                if (usuarioComEmail && usuarioComEmail.id !== id) {
                    return res.status(409).json({
                        message: 'E-mail já cadastrado.',
                    });
                }

                dadosAtualizados.email = emailNormalizado;
            }

            if (registration !== undefined) {
                const matriculaNormalizada = String(registration).trim();
                const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(matriculaNormalizada);

                if (usuarioComMatricula && usuarioComMatricula.id !== id) {
                    return res.status(409).json({
                        message: 'Matrícula já cadastrada.',
                    });
                }

                dadosAtualizados.registration = matriculaNormalizada;
            }

            if (active !== undefined) {
                if (typeof active !== 'boolean') {
                    return res.status(400).json({
                        message: 'O campo active deve ser booleano.',
                    });
                }
                if (req.usuario?.id === id && active === false) {
                    return res.status(400).json({
                        message: 'Você não pode inativar sua própria conta de gestor.',
                    });
                }
                dadosAtualizados.active = active;
            }

            if (role !== undefined) {
                if (!PAPEIS_VALIDOS.has(role)) {
                    return res.status(400).json({
                        message: 'Papel inválido. Use ALUNO ou GESTOR.',
                    });
                }
                if (req.usuario?.id === id && role !== 'GESTOR') {
                    return res.status(400).json({
                        message: 'Você não pode remover seu próprio papel de gestor.',
                    });
                }
                dadosAtualizados.role = role;
            }

            if (password !== undefined) {
                if (typeof password !== 'string' || password.length < 6) {
                    return res.status(400).json({
                        message: 'A senha deve ter ao menos 6 caracteres.',
                    });
                }
                dadosAtualizados.passwordHash = await hashSenha(password);
            }

            if (Object.keys(dadosAtualizados).length === 0) {
                return res.status(400).json({
                    message: 'Nenhum dado foi informado para atualização.',
                });
            }

            const usuario = await usuarioService.atualizarUsuario(id, dadosAtualizados);

            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao atualizar usuário.',
            });
        }
    }

    async function deletar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'ID inválido.',
                });
            }

            if (req.usuario?.id === id) {
                return res.status(400).json({
                    message: 'Você não pode excluir sua própria conta.',
                });
            }

            const usuario = await usuarioService.buscarUsuarioPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                });
            }

            await usuarioService.deletarUsuario(id);

            return res.status(204).send();
        } catch (error) {
            if (error?.code === 'P2003') {
                return res.status(409).json({
                    message: 'Não é possível excluir usuário com reservas vinculadas. Inative a conta.',
                });
            }
            console.error('Erro ao deletar usuário:', error);

            return res.status(500).json({
                message: 'Erro ao deletar usuário.',
            });
        }
    }

    return {
        listar,
        buscarPorId,
        criar,
        atualizar,
        deletar,
    };
}
