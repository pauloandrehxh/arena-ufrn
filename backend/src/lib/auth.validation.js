export class AuthValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthValidationError';
    }
}

export class AuthUnauthorizedError extends Error {
    constructor(message = 'Credenciais inválidas.') {
        super(message);
        this.name = 'AuthUnauthorizedError';
    }
}

export class AuthConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthConflictError';
    }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarDadosRegistro({ name, email, registration, password }) {
    if (typeof name !== 'string' || name.trim().length < 2) {
        throw new AuthValidationError('Nome deve ter ao menos 2 caracteres.');
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        throw new AuthValidationError('Informe um e-mail válido.');
    }

    if (typeof registration !== 'string' || registration.trim().length < 3) {
        throw new AuthValidationError('Matrícula deve ter ao menos 3 caracteres.');
    }

    if (typeof password !== 'string' || password.length < 6) {
        throw new AuthValidationError('A senha deve ter ao menos 6 caracteres.');
    }

    return {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        registration: registration.trim(),
        password,
    };
}

export function validarDadosLogin({ email, identifier, password }) {
    let identificador = '';
    if (typeof identifier === 'string' && identifier.trim()) {
        identificador = identifier.trim();
    } else if (typeof email === 'string') {
        identificador = email.trim();
    }

    if (!identificador || typeof password !== 'string' || password.length === 0) {
        throw new AuthValidationError('Informe e-mail ou matrícula e senha.');
    }

    return {
        identificador,
        password,
    };
}
