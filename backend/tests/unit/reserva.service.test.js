import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
} from '@jest/globals';

import { createReservaService } from '../../src/services/reserva.service.js';

const prismaMock = {
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
                    data: dadosReserva,
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