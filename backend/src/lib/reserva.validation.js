export class ReservaValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ReservaValidationError';
    }
}

export class ReservaNotFoundError extends Error {
    constructor() {
        super('Reserva não encontrada.');
        this.name = 'ReservaNotFoundError';
    }
}

export class ReservaConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ReservaConflictError';
    }
}

export function validarIdReserva(value, campo) {
    if (!Number.isInteger(value) || value <= 0 || value > 2147483647) {
        throw new ReservaValidationError(`${campo} deve ser um inteiro positivo válido.`);
    }
}

export function normalizarDataReserva(value) {
    const dia = value instanceof Date && Number.isFinite(value.getTime())
        ? value.toISOString().slice(0, 10)
        : value;

    if (typeof dia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dia)) {
        throw new ReservaValidationError('Data deve ser válida no formato YYYY-MM-DD.');
    }

    const data = new Date(`${dia}T00:00:00.000Z`);

    if (!Number.isFinite(data.getTime()) || data.toISOString().slice(0, 10) !== dia) {
        throw new ReservaValidationError('Data deve ser válida no formato YYYY-MM-DD.');
    }

    return data;
}

export function validarHorariosReserva(startTime, endTime) {
    if (!startTime || !endTime) {
        throw new ReservaValidationError('Horário inicial e final são obrigatórios.');
    }

    const formato = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

    if (typeof startTime !== 'string' || typeof endTime !== 'string'
        || !formato.test(startTime) || !formato.test(endTime)) {
        throw new ReservaValidationError('Horários devem ser válidos no formato HH:mm.');
    }

    if (startTime >= endTime) {
        throw new ReservaValidationError('O horário inicial deve ser anterior ao horário final.');
    }
}

const relogioFortaleza = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

function obterDataHoraFortaleza(agora) {
    const partes = Object.fromEntries(
        relogioFortaleza.formatToParts(agora).map(({ type, value }) => [type, value])
    );
    return {
        date: `${partes.year}-${partes.month}-${partes.day}`,
        time: `${partes.hour}:${partes.minute}`,
    };
}

export function inicioReservaNoFuturo(date, startTime, agora = new Date()) {
    const atual = obterDataHoraFortaleza(agora);
    return `${date.toISOString().slice(0, 10)}T${startTime}` > `${atual.date}T${atual.time}`;
}

export function validarDataFuturaReserva(date, startTime, agora = new Date()) {
    const atual = obterDataHoraFortaleza(agora);
    const dia = date.toISOString().slice(0, 10);

    if (dia < atual.date) {
        throw new ReservaValidationError('Não é possível criar uma reserva no passado.');
    }

    if (dia === atual.date && startTime <= atual.time) {
        throw new ReservaValidationError('O horário inicial deve estar no futuro.');
    }
}
