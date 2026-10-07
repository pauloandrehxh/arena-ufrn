import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
    afterEach,
} from '@jest/globals';

import { createReservaService } from '../../src/services/reserva.service.js';

const prismaMock = {
    $transaction: jest.fn(),
    usuario: {
        findUnique: jest.fn(),
    },

    quadra: {
        findUnique: jest.fn(),
    },

    reserva: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

const reservaService = createReservaService(prismaMock);

beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers({ now: new Date('2026-10-06T15:00:00.000Z') });
    prismaMock.$transaction.mockImplementation((operacao) => operacao(prismaMock));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('ReservaService', () => {
    describe('criarReserva', () => {
        test('deve criar uma reserva válida', async () => {
            const dadosReserva = {
                usuarioId: 1,
                quadraId: 1,
                date: new Date('2099-10-10'),
                startTime: '14:00',
                endTime: '15:00',
            };

            const usuario = {
                id: 1,
                active: true,
            };

            const quadra = {
                id: 1,
                active: true,
            };

            const reservaCriada = {
                id: 1,
                ...dadosReserva,
            };

            prismaMock.usuario.findUnique.mockResolvedValue(usuario);
            prismaMock.quadra.findUnique.mockResolvedValue(quadra);
            prismaMock.reserva.findFirst.mockResolvedValue(null);
            prismaMock.reserva.create.mockResolvedValue(reservaCriada);

            const resultado =
                await reservaService.criarReserva(dadosReserva);

            expect(resultado).toEqual(reservaCriada);

            expect(prismaMock.reserva.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { ...dadosReserva, status: 'ATIVA' },
                })
            );
        });

        test('deve rejeitar quando o usuário não existir', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue(null);

            await expect(
                reservaService.criarReserva({
                    usuarioId: 999,
                    quadraId: 1,
                    date: new Date('2099-10-10'),
                    startTime: '14:00',
                    endTime: '15:00',
                })
            ).rejects.toThrow('Usuário não encontrado.');
        });

        test('deve rejeitar quando o usuário estiver inativo', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: false,
            });

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 1,
                    date: new Date('2099-10-10'),
                    startTime: '14:00',
                    endTime: '15:00',
                })
            ).rejects.toThrow('Usuário inativo.');
        });

        test('deve rejeitar quando a quadra não existir', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue(null);

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 999,
                    date: new Date('2099-10-10'),
                    startTime: '14:00',
                    endTime: '15:00',
                })
            ).rejects.toThrow('Quadra não encontrada.');
        });

        test('deve rejeitar quando a quadra estiver inativa', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: false,
            });

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 1,
                    date: new Date('2099-10-10'),
                    startTime: '14:00',
                    endTime: '15:00',
                })
            ).rejects.toThrow('Quadra indisponível.');
        });

        test('deve rejeitar quando o horário inicial for igual ao final', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 1,
                    date: new Date('2099-10-10'),
                    startTime: '14:00',
                    endTime: '14:00',
                })
            ).rejects.toThrow(
                'O horário inicial deve ser anterior ao horário final.'
            );
        });

        test('deve rejeitar quando o horário inicial for depois do final', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 1,
                    date: new Date('2099-10-10'),
                    startTime: '16:00',
                    endTime: '15:00',
                })
            ).rejects.toThrow(
                'O horário inicial deve ser anterior ao horário final.'
            );
        });

        test('deve rejeitar uma reserva no passado', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 1,
                    date: new Date('2020-01-01'),
                    startTime: '14:00',
                    endTime: '15:00',
                })
            ).rejects.toThrow(
                'Não é possível criar uma reserva no passado.'
            );
        });

        test('deve rejeitar quando existir conflito de horário', async () => {
            const dadosReserva = {
                usuarioId: 1,
                quadraId: 1,
                date: new Date('2099-10-10'),
                startTime: '14:30',
                endTime: '15:30',
            };

            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.reserva.findFirst.mockResolvedValue({
                id: 10,
                quadraId: 1,
                startTime: '14:00',
                endTime: '15:00',
            });

            await expect(
                reservaService.criarReserva({
                    usuarioId: 1,
                    quadraId: 1,
                    date: new Date('2099-10-10'),
                    startTime: '14:30',
                    endTime: '15:30',
                })
            ).rejects.toThrow(
                'Já existe uma reserva para essa quadra nesse horário.'
            );

            expect(prismaMock.reserva.create).not.toHaveBeenCalled();

            expect(
                prismaMock.reserva.findFirst
            ).toHaveBeenCalledWith({
                where: {
                    quadraId: 1,
                    date: dadosReserva.date,
                    status: 'ATIVA',
                    startTime: {
                        lt: dadosReserva.endTime,
                    },
                    endTime: {
                        gt: dadosReserva.startTime,
                    },
                },
            });
        });

        test('deve permitir reserva imediatamente após outra', async () => {
            const dadosReserva = {
                usuarioId: 1,
                quadraId: 1,
                date: new Date('2099-10-10'),
                startTime: '15:00',
                endTime: '16:00',
            };

            prismaMock.usuario.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.quadra.findUnique.mockResolvedValue({
                id: 1,
                active: true,
            });

            prismaMock.reserva.findFirst.mockResolvedValue(null);

            prismaMock.reserva.create.mockResolvedValue({
                id: 2,
                ...dadosReserva,
            });

            const resultado =
                await reservaService.criarReserva(dadosReserva);

            expect(resultado.id).toBe(2);
            expect(prismaMock.reserva.create).toHaveBeenCalled();
        });
    });
});

describe('US01 - validação e integridade da criação', () => {
    const dadosValidos = {
        usuarioId: 1,
        quadraId: 1,
        date: '2026-10-07',
        startTime: '14:00',
        endTime: '15:00',
    };

    beforeEach(() => {
        prismaMock.usuario.findUnique.mockResolvedValue({ id: 1, active: true });
        prismaMock.quadra.findUnique.mockResolvedValue({ id: 1, active: true });
        prismaMock.reserva.findFirst.mockResolvedValue(null);
        prismaMock.reserva.create.mockImplementation(({ data }) => ({ id: 1, ...data }));
    });

    test.each([
        ['usuarioId', 0], ['usuarioId', -1], ['usuarioId', 1.5],
        ['usuarioId', '1'], ['usuarioId', 2147483648],
        ['quadraId', null], ['quadraId', true], ['quadraId', NaN],
        ['date', '2026-02-30'], ['date', '2026-13-01'],
        ['date', '2026-10-07T00:00:00Z'], ['date', 123],
        ['date', new Date(NaN)], ['date', undefined],
        ['startTime', '9:00'], ['startTime', '24:00'],
        ['startTime', '14:60'], ['startTime', 1400],
        ['startTime', ''], ['endTime', undefined],
        ['endTime', '15:00:00'], ['endTime', {}],
    ])('rejeita %s=%p antes de acessar o banco', async (campo, valor) => {
        await expect(reservaService.criarReserva({ ...dadosValidos, [campo]: valor }))
            .rejects.toThrow();
        expect(prismaMock.$transaction).not.toHaveBeenCalled();
        expect(prismaMock.reserva.create).not.toHaveBeenCalled();
    });

    test.each(['11:59', '12:00'])('rejeita início %s já alcançado em Fortaleza', async (startTime) => {
        await expect(reservaService.criarReserva({
            ...dadosValidos, date: '2026-10-06', startTime,
        })).rejects.toThrow('O horário inicial deve estar no futuro.');
        expect(prismaMock.reserva.create).not.toHaveBeenCalled();
    });

    test('aceita início futuro no mesmo dia', async () => {
        const reserva = await reservaService.criarReserva({
            ...dadosValidos, date: '2026-10-06', startTime: '12:01',
        });
        expect(reserva.date).toEqual(new Date('2026-10-06T00:00:00.000Z'));
    });

    test('usa o dia de Fortaleza, não o dia UTC do servidor', async () => {
        jest.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
        const reserva = await reservaService.criarReserva({
            ...dadosValidos, date: '2026-10-05', startTime: '23:45', endTime: '23:59',
        });
        expect(reserva.date).toEqual(new Date('2026-10-05T00:00:00.000Z'));
    });

    test('aceita dia bissexto válido e normaliza sua representação', async () => {
        const reserva = await reservaService.criarReserva({ ...dadosValidos, date: '2028-02-29' });
        expect(reserva.date).toEqual(new Date('2028-02-29T00:00:00.000Z'));
    });

    test('define ATIVA e ignora campos internos fornecidos pelo chamador', async () => {
        const reserva = await reservaService.criarReserva({
            ...dadosValidos, status: 'CANCELADA', id: 999, createdAt: new Date(),
        });
        expect(reserva.id).toBe(1);
        expect(reserva.status).toBe('ATIVA');
        expect(prismaMock.reserva.create).toHaveBeenCalledWith({
            data: { ...dadosValidos, date: new Date('2026-10-07'), status: 'ATIVA' },
            include: { usuario: true, quadra: true },
        });
    });

    test('consulta apenas reservas ATIVA na transação', async () => {
        await reservaService.criarReserva(dadosValidos);
        expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
        expect(prismaMock.reserva.findFirst).toHaveBeenCalledWith({
            where: {
                quadraId: 1, date: new Date('2026-10-07'), status: 'ATIVA',
                startTime: { lt: '15:00' }, endTime: { gt: '14:00' },
            },
        });
    });

    test('propaga falha de dependência sem tentar criar registro', async () => {
        prismaMock.usuario.findUnique.mockRejectedValue(new Error('Falha interna do banco'));
        await expect(reservaService.criarReserva(dadosValidos)).rejects.toThrow('Falha interna do banco');
        expect(prismaMock.reserva.create).not.toHaveBeenCalled();
    });
});

describe('Regressão - validações compartilhadas na atualização', () => {
    beforeEach(() => {
        prismaMock.reserva.findUnique.mockResolvedValue({
            id: 1, usuarioId: 1, quadraId: 1, date: new Date('2099-10-10'),
            startTime: '14:00', endTime: '15:00', status: 'ATIVA',
        });
        prismaMock.usuario.findUnique.mockResolvedValue({ id: 2, active: true });
        prismaMock.quadra.findUnique.mockResolvedValue({ id: 2, active: true });
        prismaMock.reserva.findFirst.mockResolvedValue(null);
        prismaMock.reserva.update.mockResolvedValue({ id: 1 });
    });

    test('valida usuário/quadra alterados e exclui a própria reserva do conflito', async () => {
        await reservaService.atualizarReserva(1, { usuarioId: 2, quadraId: 2 });
        expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(prismaMock.quadra.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(prismaMock.reserva.findFirst).toHaveBeenCalledWith({
            where: {
                id: { not: 1 }, quadraId: 2, date: new Date('2099-10-10'), status: 'ATIVA',
                startTime: { lt: '15:00' }, endTime: { gt: '14:00' },
            },
        });
    });

    test('não atualiza reserva inexistente', async () => {
        prismaMock.reserva.findUnique.mockResolvedValue(null);
        await expect(reservaService.atualizarReserva(999, {})).rejects.toThrow('Reserva não encontrada.');
        expect(prismaMock.reserva.update).not.toHaveBeenCalled();
    });

    test('não atualiza em caso de conflito', async () => {
        prismaMock.reserva.findFirst.mockResolvedValue({ id: 2 });
        await expect(reservaService.atualizarReserva(1, { startTime: '14:30' }))
            .rejects.toThrow('Já existe uma reserva');
        expect(prismaMock.reserva.update).not.toHaveBeenCalled();
    });

    test('não atualiza quando horários têm formato inválido', async () => {
        await expect(reservaService.atualizarReserva(1, { startTime: '9:00' }))
            .rejects.toThrow('Horários devem ser válidos');
        expect(prismaMock.reserva.update).not.toHaveBeenCalled();
    });

    test('persiste a data normalizada recebida diretamente pelo service', async () => {
        await reservaService.atualizarReserva(1, { date: '2099-10-11' });
        expect(prismaMock.reserva.update).toHaveBeenCalledWith(expect.objectContaining({
            data: { date: new Date('2099-10-11T00:00:00.000Z') },
        }));
    });
});
