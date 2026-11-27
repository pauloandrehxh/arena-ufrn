export class ApiError extends Error {
    constructor(message, status, payload = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.payload = payload;
    }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
    const config = {
        method,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...headers,
        },
    };

    if (body !== undefined) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
    }

    const response = await fetch(path, config);

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : null;

    if (!response.ok) {
        const message =
            data?.message ||
            data?.erro ||
            `Erro na requisição (${response.status}).`;
        throw new ApiError(message, response.status, data);
    }

    return data;
}

function buildQuery(params = {}) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            search.set(key, String(value));
        }
    }
    const str = search.toString();
    return str ? `?${str}` : '';
}

export const authApi = {
    me: () => request('/api/auth/me'),
    login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
    register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
};

export const quadrasApi = {
    listar: () => request('/api/quadras'),
    buscarPorId: (id) => request(`/api/quadras/${id}`),
    criar: (payload) => request('/api/quadras', { method: 'POST', body: payload }),
    atualizar: (id, payload) => request(`/api/quadras/${id}`, { method: 'PUT', body: payload }),
    alterarStatus: (id, active) =>
        request(`/api/quadras/${id}/status`, { method: 'PATCH', body: { active } }),
    deletar: (id) => request(`/api/quadras/${id}`, { method: 'DELETE' }),
};

export const disponibilidadeApi = {
    consultar: ({ quadraId, date }) =>
        request(`/api/quadras/disponibilidade${buildQuery({ quadraId, date })}`),
};

export const reservasApi = {
    listarMinhas: (filtros = {}) =>
        request(`/api/reservas/minhas${buildQuery(filtros)}`),
    listarTodas: (filtros = {}) =>
        request(`/api/reservas${buildQuery(filtros)}`),
    criar: (payload) => request('/api/reservas', { method: 'POST', body: payload }),
    atualizar: (id, payload) => request(`/api/reservas/${id}`, { method: 'PUT', body: payload }),
    cancelar: (id) => request(`/api/reservas/${id}/cancelamento`, { method: 'PATCH' }),
};

export const usuariosApi = {
    listar: () => request('/api/usuarios'),
    criar: (payload) => request('/api/usuarios', { method: 'POST', body: payload }),
    atualizar: (id, payload) => request(`/api/usuarios/${id}`, { method: 'PUT', body: payload }),
    deletar: (id) => request(`/api/usuarios/${id}`, { method: 'DELETE' }),
};
