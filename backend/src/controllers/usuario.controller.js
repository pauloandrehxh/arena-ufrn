import { hashSenha } from '../lib/password.js';

const PAPEIS_VALIDOS = new Set(['ALUNO', 'GESTOR']);

function validarCamposSimplesAtualizacao(id, body, usuarioLogadoId) {
    const dados = {};

    if (body.name !== undefined) {
        if (typeof body.name !== 'string' || body.name.trim().length < 2) {
            return { erro: { status: 400, message: 'Nome deve ter ao menos 2 caracteres.' } };
        }
        dados.name = body.name.trim();
    }

    if (body.active !== undefined) {
        if (typeof body.active !== 'boolean') {
            return { erro: { status: 400, message: 'O campo active deve ser booleano.' } };
        }
        if (usuarioLogadoId === id && body.active === false) {
            return { erro: { status: 400, message: 'Você não pode inativar sua própria conta de gestor.' } };
        }
        dados.active = body.active;
    }

    if (body.role !== undefined) {
        if (!PAPEIS_VALIDOS.has(body.role)) {
            return { erro: { status: 400, message: 'Papel inválido. Use ALUNO ou GESTOR.' } };
        }
        if (usuarioLogadoId === id && body.role !== 'GESTOR') {
            return { erro: { status: 400, message: 'Você não pode remover seu próprio papel de gestor.' } };
        }
        dados.role = body.role;
    }

    return { dados };
}

async function validarCamposUnicosESenha(id, body, usuarioService) {
    const dados = {};

    if (body.email !== undefined) {
        const emailNormalizado = String(body.email).trim().toLowerCase();
        const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(emailNormalizado);
        if (usuarioComEmail && usuarioComEmail.id !== id) {
            return { erro: { status: 409, message: 'E-mail já cadastrado.' } };
        }
        dados.email = emailNormalizado;
    }

    if (body.registration !== undefined) {
        const matriculaNormalizada = String(body.registration).trim();
        const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(matriculaNormalizada);
        if (usuarioComMatricula && usuarioComMatricula.id !== id) {
            return { erro: { status: 409, message: 'Matrícula já cadastrada.' } };
        }
        dados.registration = matriculaNormalizada;
    }

    if (body.password !== undefined) {
        if (typeof body.password !== 'string' || body.password.length < 6) {
            return { erro: { status: 400, message: 'A senha deve ter ao menos 6 caracteres.' } };
        }
        dados.passwordHash = await hashSenha(body.password);
    }

    return { dados };
}

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

            if (password === undefined) {
                dados.passwordHash = await hashSenha('Arena@123');
            } else {
                if (typeof password !== 'string' || password.length < 6) {
                    return res.status(400).json({
                        message: 'A senha deve ter ao menos 6 caracteres.',
                    });
                }
                dados.passwordHash = await hashSenha(password);
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

            const body = req.body ?? {};
            const simples = validarCamposSimplesAtualizacao(id, body, req.usuario?.id);
            if (simples.erro) {
                return res.status(simples.erro.status).json({ message: simples.erro.message });
            }

            const unicos = await validarCamposUnicosESenha(id, body, usuarioService);
            if (unicos.erro) {
                return res.status(unicos.erro.status).json({ message: unicos.erro.message });
            }

            const dadosAtualizados = { ...simples.dados, ...unicos.dados };

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
