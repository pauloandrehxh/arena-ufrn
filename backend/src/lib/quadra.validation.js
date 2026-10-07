export class QuadraValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'QuadraValidationError';
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
