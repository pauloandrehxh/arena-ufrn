import {
    ReservaValidationError, ReservaNotFoundError, ReservaConflictError, normalizarDataReserva,
} from '../lib/reserva.validation.js';

function responderErroOperacao(res, error, mensagem) {
    if (error instanceof ReservaValidationError) {
        return res.status(400).json({ message: error.message });
    }
    if (error instanceof ReservaNotFoundError) {
        return res.status(404).json({ message: error.message });
    }
    if (error instanceof ReservaConflictError) {
        return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: mensagem });
}

export function createReservaController(reservaService) {
    async function listar(req, res) {
        try {
            const reservas = await reservaService.listarReservas();

            return res.status(200).json(reservas);
        } catch {
            return res.status(500).json({
                message: 'Erro ao listar reservas.',
            });
        }
    }

    async function buscarPorId(req, res) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                message: 'ID inválido.',
            });
        }

        try {
            const reserva = await reservaService.buscarReservaPorId(id);

            if (!reserva) {
                return res.status(404).json({
                    message: 'Reserva não encontrada.',
                });
            }

            return res.status(200).json(reserva);
        } catch {
            return res.status(500).json({
                message: 'Erro ao buscar reserva.',
            });
        }
    }

    async function listarPorUsuario(req, res) {
        const usuarioId = Number(req.params.usuarioId);

        if (!Number.isInteger(usuarioId)) {
            return res.status(400).json({
                message: 'ID de usuário inválido.',
            });
        }

        try {
            const reservas =
                await reservaService.buscarReservasPorUsuario(usuarioId);

            return res.status(200).json(reservas);
        } catch {
            return res.status(500).json({
                message: 'Erro ao buscar reservas do usuário.',
            });
        }
    }

    async function listarPorQuadra(req, res) {
        const quadraId = Number(req.params.quadraId);

        if (!Number.isInteger(quadraId)) {
            return res.status(400).json({
                message: 'ID de quadra inválido.',
            });
        }

        try {
            const reservas =
                await reservaService.buscarReservasPorQuadra(quadraId);

            return res.status(200).json(reservas);
        } catch {
            return res.status(500).json({
                message: 'Erro ao buscar reservas da quadra.',
            });
        }
    }

    async function criar(req, res) {
        const {
            usuarioId,
            quadraId,
            date,
            startTime,
            endTime,
        } = req.body ?? {};

        if (
            !usuarioId ||
            !quadraId ||
            !date ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message: 'Todos os campos são obrigatórios.',
            });
        }

        try {
            if (typeof date !== 'string') {
                throw new ReservaValidationError('Data deve ser válida no formato YYYY-MM-DD.');
            }

            const reserva = await reservaService.criarReserva({
                usuarioId,
                quadraId,
                date: normalizarDataReserva(date),
                startTime,
                endTime,
            });

            return res.status(201).json(reserva);
        } catch (error) {
            const validacao = error instanceof ReservaValidationError;

            return res.status(validacao ? 400 : 500).json({
                message: validacao ? error.message : 'Erro ao criar reserva.',
            });
        }
    }

    async function atualizar(req, res) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
            return res.status(400).json({
                message: 'ID inválido.',
            });
        }

        try {
            const dados = { ...req.body };

            if (dados.date) {
                dados.date = normalizarDataReserva(dados.date);
            }

            const reserva =
                await reservaService.atualizarReserva(id, dados);

            return res.status(200).json(reserva);
        } catch (error) {
            return responderErroOperacao(res, error, 'Erro ao atualizar reserva.');
        }
    }

    async function cancelar(req, res) {
        try {
            const reserva = await reservaService.cancelarReserva(Number(req.params.id));
            return res.status(200).json(reserva);
        } catch (error) {
            return responderErroOperacao(res, error, 'Erro ao cancelar reserva.');
        }
    }

    async function deletar(req, res) {
        try {
            await reservaService.cancelarReserva(Number(req.params.id));
            return res.status(204).send();
        } catch (error) {
            return responderErroOperacao(res, error, 'Erro ao cancelar reserva.');
        }
    }

    return {
        listar,
        buscarPorId,
        listarPorUsuario,
        listarPorQuadra,
        criar,
        atualizar,
        cancelar,
        deletar
    };
}
