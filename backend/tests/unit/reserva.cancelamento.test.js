import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { createReservaService } from '../../src/services/reserva.service.js';
import { ReservaConflictError, ReservaNotFoundError } from '../../src/lib/reserva.validation.js';

const prisma = {
    $transaction: jest.fn(),
    reserva: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
};
const agora = jest.fn();
const service = createReservaService(prisma, { agora });
const reserva = {
    id: 1, usuarioId: 2, quadraId: 3, date: new Date('2099-10-10'),
    startTime: '14:00', endTime: '15:00', status: 'ATIVA',
};

beforeEach(() => {
    jest.resetAllMocks();
    agora.mockReturnValue(new Date('2099-10-10T16:00:00Z'));
    prisma.$transaction.mockImplementation((operacao) => operacao(prisma));
    prisma.reserva.findUnique.mockResolvedValue({ ...reserva });
    prisma.reserva.update.mockResolvedValue({ ...reserva, status: 'CANCELADA' });
});

describe('US03 - cancelarReserva com dependências isoladas', () => {
    test('altera somente status em transação com proteção de estado/intervalo', async () => {
        expect(await service.cancelarReserva(1)).toEqual({ ...reserva, status: 'CANCELADA' });
        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(prisma.reserva.update).toHaveBeenCalledWith({
            where: { id: 1, status: 'ATIVA', date: reserva.date, startTime: '14:00' },
            data: { status: 'CANCELADA' }, include: { usuario: true, quadra: true },
        });
        expect(prisma.reserva.delete).not.toHaveBeenCalled();
    });

    test('CANCELADA é idempotente mesmo quando a data já passou', async () => {
        prisma.reserva.findUnique.mockResolvedValue({ ...reserva, status: 'CANCELADA' });
        agora.mockReturnValue(new Date('2100-01-01'));
        expect((await service.cancelarReserva(1)).status).toBe('CANCELADA');
        expect(prisma.reserva.update).not.toHaveBeenCalled();
    });

    test('retorna erro específico para inexistente', async () => {
        prisma.reserva.findUnique.mockResolvedValue(null);
        await expect(service.cancelarReserva(1)).rejects.toBeInstanceOf(ReservaNotFoundError);
        expect(prisma.reserva.update).not.toHaveBeenCalled();
    });

    test.each([0, -1, 1.5, NaN, '1', 2147483648])('rejeita ID %p antes do banco', async (id) => {
        await expect(service.cancelarReserva(id)).rejects.toThrow('inteiro positivo');
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    test('não cancela CONCLUIDA', async () => {
        prisma.reserva.findUnique.mockResolvedValue({ ...reserva, status: 'CONCLUIDA' });
        await expect(service.cancelarReserva(1)).rejects.toBeInstanceOf(ReservaConflictError);
        expect(prisma.reserva.update).not.toHaveBeenCalled();
    });

    test.each(['2099-10-10T17:00:00Z', '2099-10-10T17:01:00Z', '2099-10-11T03:00:00Z'])(
        'não cancela quando início já foi alcançado em %s', async (instante) => {
            agora.mockReturnValue(new Date(instante));
            await expect(service.cancelarReserva(1)).rejects.toThrow('já iniciada');
            expect(prisma.reserva.update).not.toHaveBeenCalled();
        }
    );

    test('aceita início um minuto no futuro', async () => {
        agora.mockReturnValue(new Date('2099-10-10T16:59:59Z'));
        await expect(service.cancelarReserva(1)).resolves.toMatchObject({ status: 'CANCELADA' });
    });

    test('usa o dia local de Fortaleza na fronteira UTC', async () => {
        agora.mockReturnValue(new Date('2099-10-10T02:30:00Z'));
        prisma.reserva.findUnique.mockResolvedValue({
            ...reserva, date: new Date('2099-10-09'), startTime: '23:45', endTime: '23:59',
        });
        await expect(service.cancelarReserva(1)).resolves.toBeDefined();
        expect(prisma.reserva.update).toHaveBeenCalled();
    });

    test('propaga erro da persistência sem excluir dados', async () => {
        prisma.reserva.update.mockRejectedValue(new Error('erro interno'));
        await expect(service.cancelarReserva(1)).rejects.toThrow('erro interno');
        expect(prisma.reserva.delete).not.toHaveBeenCalled();
    });

    test('transforma atualização perdida em conflito', async () => {
        prisma.reserva.update.mockRejectedValue(Object.assign(new Error('conflito'), { code: 'P2025' }));
        await expect(service.cancelarReserva(1)).rejects.toBeInstanceOf(ReservaConflictError);
    });

    test('alias legado de exclusão cancela, não apaga', async () => {
        await expect(service.deletarReserva(1)).resolves.toMatchObject({ status: 'CANCELADA' });
        expect(prisma.reserva.delete).not.toHaveBeenCalled();
    });
});

describe('US03 - proteção do PUT', () => {
    test.each(['status', 'id', 'createdAt', 'usuario'])('rejeita campo interno %s', async (campo) => {
        await expect(service.atualizarReserva(1, { [campo]: 'valor' })).rejects.toThrow('Somente usuário');
        expect(prisma.reserva.update).not.toHaveBeenCalled();
    });

    test.each(['CANCELADA', 'CONCLUIDA'])('não modifica reserva %s', async (status) => {
        prisma.reserva.findUnique.mockResolvedValue({ ...reserva, status });
        await expect(service.atualizarReserva(1, { startTime: '15:00' })).rejects.toBeInstanceOf(ReservaConflictError);
        expect(prisma.reserva.update).not.toHaveBeenCalled();
    });

    test('PUT condiciona gravação a ATIVA e trata cancelamento concorrente', async () => {
        prisma.reserva.findFirst.mockResolvedValue(null);
        prisma.reserva.update.mockRejectedValue(Object.assign(new Error('mudou'), { code: 'P2025' }));
        await expect(service.atualizarReserva(1, { startTime: '14:30' })).rejects.toBeInstanceOf(ReservaConflictError);
        expect(prisma.reserva.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 1, status: 'ATIVA' },
        }));
    });

    test('PUT não transforma erro inesperado em sucesso', async () => {
        prisma.reserva.findFirst.mockResolvedValue(null);
        prisma.reserva.update.mockRejectedValue(new Error('erro banco'));
        await expect(service.atualizarReserva(1, { startTime: '14:30' })).rejects.toThrow('erro banco');
    });

    test('PUT não permite mover reserva iniciada para o futuro e depois cancelar', async () => {
        agora.mockReturnValue(new Date('2099-10-10T17:00:00Z'));
        await expect(service.atualizarReserva(1, { date: '2099-10-11' }))
            .rejects.toThrow('atualizar uma reserva já iniciada');
        expect(prisma.reserva.update).not.toHaveBeenCalled();
    });
});
