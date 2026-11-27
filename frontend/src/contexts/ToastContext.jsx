import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remover = useCallback((id) => {
        setToasts((lista) => lista.filter((item) => item.id !== id));
    }, []);

    const adicionar = useCallback((tipo, mensagem) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        setToasts((lista) => [...lista, { id, tipo, mensagem }]);
        setTimeout(() => {
            setToasts((lista) => lista.filter((item) => item.id !== id));
        }, 4500);
    }, []);

    const api = {
        sucesso: (mensagem) => adicionar('sucesso', mensagem),
        erro: (mensagem) => adicionar('erro', mensagem),
        info: (mensagem) => adicionar('info', mensagem),
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div
                aria-live="polite"
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
            >
                {toasts.map((toast) => {
                    const estilos = {
                        sucesso: 'bg-emerald-950 text-emerald-50 border-emerald-700',
                        erro: 'bg-rose-950 text-rose-50 border-rose-700',
                        info: 'bg-ufrn-950 text-white border-ufrn-700',
                    }[toast.tipo];

                    const Icone = {
                        sucesso: CheckCircle2,
                        erro: AlertCircle,
                        info: Info,
                    }[toast.tipo];

                    return (
                        <div
                            key={toast.id}
                            role="status"
                            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${estilos}`}
                        >
                            <Icone className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="flex-1 leading-snug">{toast.mensagem}</p>
                            <button
                                type="button"
                                onClick={() => remover(toast.id)}
                                className="opacity-75 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded cursor-pointer"
                                aria-label="Fechar notificação"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast deve ser utilizado dentro de ToastProvider.');
    }
    return ctx;
}
