
import { HORARIO_FUNCIONAMENTO } from '../lib/disponibilidade.config.js';

function validarData(data) {
    if (
        typeof data !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data)
    ) {
        throw new Error('Data inválida. Use o formato AAAA-MM-DD.');
    }

    const dataObj = new Date(`${data}T00:00:00.000Z`);

    if (
        Number.isNaN(dataObj.getTime()) ||
        dataObj.toISOString().slice(0, 10) !== data
    ) {
        throw new Error('Data inválida. Informe uma data existente.');
    }

    return dataObj;
}

function formatarHorario(valor) {
    const horas = String(Math.floor(valor / 60)).padStart(2, '0');
    const minutos = String(valor % 60).padStart(2, '0');

    return `${horas}:${minutos}`;
}

function gerarIntervalos() {
    const { inicio, fim, duracaoMinutos } = HORARIO_FUNCIONAMENTO;

    const [ih, im] = inicio.split(':').map(Number);
    const [fh, fm] = fim.split(':').map(Number);

    const inicioMinutos = ih * 60 + im;
    const fimMinutos = fh * 60 + fm;

    if (
        !Number.isInteger(duracaoMinutos) ||
        duracaoMinutos <= 0 ||
        inicioMinutos >= fimMinutos
    ) {
        throw new Error('Configuração de funcionamento inválida.');
    }

    const intervalos = [];

    for (
        let minuto = inicioMinutos;
        minuto + duracaoMinutos <= fimMinutos;
        minuto += duracaoMinutos
    ) {
        intervalos.push({
            startTime: formatarHorario(minuto),
            endTime: formatarHorario(minuto + duracaoMinutos),
        });
    }

    return intervalos;
}

export function createDisponibilidadeService(prisma) {
    async function consultar({ quadraId, date }) {
        if (
            quadraId === undefined ||
            quadraId === null ||
            String(quadraId).trim() === ''
        ) {
            throw new Error('ID da quadra é obrigatório.');
        }

        const id = Number(quadraId);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID da quadra inválido.');
        }

        const dataObj = validarData(date);

        const quadra = await prisma.quadra.findUnique({
            where: { id },
        });

        if (!quadra) {
            const erro = new Error('Quadra não encontrada.');
            erro.status = 404;
            throw erro;
        }

        if (!quadra.active) {
            const erro = new Error('Quadra indisponível.');
            erro.status = 409;
            throw erro;
        }

        const reservas = await prisma.reserva.findMany({
            where: {
                quadraId: id,
                date: dataObj,
                status: 'ATIVA',
            },
            select: {
                startTime: true,
                endTime: true,
                status: true,
            },
            orderBy: { startTime: 'asc' },
        });

        const ocupacoes = reservas.map((reserva) => ({
            startTime: reserva.startTime,
            endTime: reserva.endTime,
            status: reserva.status,
        }));

        const intervalos = gerarIntervalos();

        const disponiveis = intervalos.filter((intervalo) =>
            !reservas.some((reserva) =>
                reserva.startTime < intervalo.endTime &&
                intervalo.startTime < reserva.endTime
            )
        );

        return {
            quadraId: id,
            date,
            horarioFuncionamento: HORARIO_FUNCIONAMENTO,
            ocupacoes,
            disponiveis,
        };
    }

    return { consultar };
}
