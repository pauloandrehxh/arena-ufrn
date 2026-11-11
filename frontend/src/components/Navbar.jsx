import { useState } from 'react';

export function Navbar() {
    const [menuAberto, setMenuAberto] = useState(false);
    const menuId = 'menu-navegacao-mobile';

    const alternarMenu = () => {
        setMenuAberto((aberto) => !aberto);
    };

    const fecharMenu = () => {
        setMenuAberto(false);
    };

    const linkClassName =
        'text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded';

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl" aria-hidden="true">🏖️</span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight truncate">Arena UFRN</span>
                </div>

                <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
                    <a href="#inicio" className={linkClassName}>
                        Início
                    </a>
                    <a href="#quadras" className={linkClassName}>
                        Quadras
                    </a>
                    <a href="#como-funciona" className={linkClassName}>
                        Como Funciona
                    </a>
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        aria-label={menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                        aria-expanded={menuAberto}
                        aria-controls={menuId}
                        onClick={alternarMenu}
                    >
                        {menuAberto ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div
                id={menuId}
                className={`${menuAberto ? 'block' : 'hidden'} md:hidden border-t border-slate-200 bg-white`}
            >
                <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2" aria-label="Navegação principal móvel">
                    <a href="#inicio" className={`${linkClassName} py-2`} onClick={fecharMenu}>
                        Início
                    </a>
                    <a href="#quadras" className={`${linkClassName} py-2`} onClick={fecharMenu}>
                        Quadras
                    </a>
                    <a href="#como-funciona" className={`${linkClassName} py-2`} onClick={fecharMenu}>
                        Como Funciona
                    </a>
                </nav>
            </div>
        </header>
    );
}
