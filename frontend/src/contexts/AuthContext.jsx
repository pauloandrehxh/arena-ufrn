import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const recarregarSessao = useCallback(async () => {
        try {
            const data = await authApi.me();
            setUsuario(data?.user ?? null);
        } catch {
            setUsuario(null);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let cancelado = false;
        authApi.me()
            .then((data) => {
                if (!cancelado) setUsuario(data?.user ?? null);
            })
            .catch(() => {
                if (!cancelado) setUsuario(null);
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const login = useCallback(async (credenciais) => {
        const data = await authApi.login(credenciais);
        setUsuario(data.user);
        return data.user;
    }, []);

    const registrar = useCallback(async (dados) => {
        const data = await authApi.register(dados);
        setUsuario(data.user);
        return data.user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            setUsuario(null);
        }
    }, []);

    const value = useMemo(() => ({
        usuario,
        carregando,
        autenticado: Boolean(usuario),
        ehGestor: usuario?.role === 'GESTOR',
        login,
        registrar,
        logout,
        recarregarSessao,
    }), [usuario, carregando, login, registrar, logout, recarregarSessao]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
    }
    return ctx;
}
