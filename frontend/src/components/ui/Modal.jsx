import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

export function Modal({ aberto, onFechar, titulo, descricao, children, largura = 'max-w-lg' }) {
    useEffect(() => {
        if (!aberto) return undefined;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onFechar();
            }
        };
        globalThis.addEventListener('keydown', onKeyDown);
        return () => globalThis.removeEventListener('keydown', onKeyDown);
    }, [aberto, onFechar]);

    if (!aberto) return null;

    return (
        <dialog
            open
            aria-modal="true"
            aria-labelledby="modal-titulo"
            className="fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none bg-transparent p-4 flex items-center justify-center border-0"
        >
            <button
                type="button"
                aria-label="Fechar janela"
                onClick={onFechar}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs border-0 p-0 cursor-default"
            />
            <div
                className={`relative z-10 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full ${largura} max-h-[90vh] overflow-y-auto`}
            >
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100">
                    <div>
                        <h3 id="modal-titulo" className="text-lg font-bold text-slate-900">
                            {titulo}
                        </h3>
                        {descricao && (
                            <p className="text-sm text-slate-500 mt-1">{descricao}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onFechar}
                        aria-label="Fechar janela"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </dialog>
    );
}

Modal.propTypes = {
    aberto: PropTypes.bool,
    onFechar: PropTypes.func,
    titulo: PropTypes.node,
    descricao: PropTypes.node,
    children: PropTypes.node,
    largura: PropTypes.string,
};
