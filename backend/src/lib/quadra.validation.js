export class QuadraValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'QuadraValidationError';
    }
}

export class QuadraNotFoundError extends Error {
    constructor(message = 'Quadra não encontrada.') {
        super(message);
        this.name = 'QuadraNotFoundError';
    }
}

export class QuadraConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'QuadraConflictError';
    }
}

export function validarIdQuadra(id) {
    if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
        throw new QuadraValidationError('ID da quadra deve ser um inteiro positivo válido.');
    }
}

export function validarNomeQuadra(name) {
    if (typeof name !== 'string' || name.trim().length === 0) {
        throw new QuadraValidationError('Nome da quadra deve ser um texto não vazio.');
    }
}

export function validarTextoOpcional(valor, campo) {
    if (valor !== undefined && typeof valor !== 'string') {
        throw new QuadraValidationError(`${campo} da quadra deve ser um texto.`);
    }
}

export function validarStatusAtivo(active) {
    if (typeof active !== 'boolean') {
        throw new QuadraValidationError('O campo active deve ser booleano (true ou false).');
    }
}
