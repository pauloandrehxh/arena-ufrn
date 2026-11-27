import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
    CalendarCheck2,
    LogIn,
    LogOut,
    Menu,
    ShieldCheck,
    Sun,
    UserPlus,
    X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function Navbar() {
    const [menuAberto, setMenuAberto] = useState(false);
    const { usuario, autenticado, ehGestor, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const menuId = 'menu-navegacao-mobile';

    const naHome = location.pathname === '/';

    const fecharMenu = () => setMenuAberto(false);

    const handleLogout = async () => {
        await logout();
        fecharMenu();
        toast.info('Sessão encerrada com segurança.');
        navigate('/');
    };

    const linkClassName =
        'text-sm font-semibold text-slate-600 hover:text-ufrn-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600 focus-visible:ring-offset-2 rounded-lg px-2 py-1.5';

    const linkAtivo = (path) =>
        location.pathname === path
            ? 'text-ufrn-800 bg-ufrn-50'
            : 'text-slate-600 hover:text-ufrn-700 hover:bg-slate-100/70';

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-sand-200 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
                <Link
                    to="/"
                    onClick={fecharMenu}
                    className="flex items-center gap-2.5 min-w-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600 rounded-xl"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ufrn-800 to-ufrn-600 text-amber-300 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                        <Sun className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <span className="block text-lg font-extrabold text-slate-900 tracking-tight leading-none truncate">
                            Arena UFRN
                        </span>
                        <span className="hidden sm:block text-[11px] font-medium text-slate-500 leading-tight">
                            Quadras de Areia
                        </span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
                    {naHome ? (
                        <>
                            <a href="#inicio" className={linkClassName}>Início</a>
                            <a href="#quadras" className={linkClassName}>Quadras</a>
                            <a href="#como-funciona" className={linkClassName}>Como Funciona</a>
                        </>
                    ) : (
                        <>
                            <Link to="/" className={`${linkClassName} ${linkAtivo('/')}`}>Início</Link>
                            <Link to="/#quadras" className={linkClassName}>Quadras</Link>
                        </>
                    )}

                    {autenticado && (
                        <Link
                            to="/minhas-reservas"
                            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${linkAtivo('/minhas-reservas')}`}
                        >
                            <CalendarCheck2 className="w-4 h-4" aria-hidden="true" />
                            Minhas Reservas
                        </Link>
                    )}

                    {ehGestor && (
                        <Link
                            to="/admin"
                            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                location.pathname === '/admin'
                                    ? 'bg-ufrn-800 text-white'
                                    : 'bg-ufrn-50 text-ufrn-800 hover:bg-ufrn-100'
                            }`}
                        >
                            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                            Painel Gestor
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {autenticado ? (
                        <div className="hidden sm:flex items-center gap-2.5">
                            <div className="text-right leading-tight">
                                <p className="text-xs font-bold text-slate-800 max-w-[140px] truncate">
                                    {usuario.name}
                                </p>
                                <p className="text-[11px] font-medium text-slate-500">
                                    {ehGestor ? 'Gestor' : `Mat. ${usuario.registration}`}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600"
                                title="Sair da conta"
                            >
                                <LogOut className="w-4 h-4" aria-hidden="true" />
                                <span>Sair</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/cadastro"
                                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-ufrn-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <UserPlus className="w-4 h-4" aria-hidden="true" />
                                Criar conta
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600 focus-visible:ring-offset-2"
                            >
                                <LogIn className="w-4 h-4" aria-hidden="true" />
                                Entrar
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600"
                        aria-label={menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                        aria-expanded={menuAberto}
                        aria-controls={menuId}
                        onClick={() => setMenuAberto((aberto) => !aberto)}
                    >
                        {menuAberto ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <div
                id={menuId}
                className={`${menuAberto ? 'block' : 'hidden'} md:hidden border-t border-sand-200 bg-white`}
            >
                <nav
                    className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1.5"
                    aria-label="Navegação principal móvel"
                >
                    {naHome ? (
                        <>
                            <a href="#inicio" className={`${linkClassName} py-2.5`} onClick={fecharMenu}>Início</a>
                            <a href="#quadras" className={`${linkClassName} py-2.5`} onClick={fecharMenu}>Quadras</a>
                            <a href="#como-funciona" className={`${linkClassName} py-2.5`} onClick={fecharMenu}>Como Funciona</a>
                        </>
                    ) : (
                        <>
                            <Link to="/" className={`${linkClassName} py-2.5`} onClick={fecharMenu}>Início</Link>
                            <Link to="/#quadras" className={`${linkClassName} py-2.5`} onClick={fecharMenu}>Quadras</Link>
                        </>
                    )}

                    {autenticado ? (
                        <>
                            <Link
                                to="/minhas-reservas"
                                onClick={fecharMenu}
                                className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                <CalendarCheck2 className="w-4 h-4 text-ufrn-700" />
                                Minhas Reservas
                            </Link>
                            {ehGestor && (
                                <Link
                                    to="/admin"
                                    onClick={fecharMenu}
                                    className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm font-semibold text-ufrn-800 bg-ufrn-50"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Painel Gestor (Restrito)
                                </Link>
                            )}
                            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{usuario.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{usuario.email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sair
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                            <Link
                                to="/cadastro"
                                onClick={fecharMenu}
                                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                            >
                                Criar Conta de Aluno
                            </Link>
                            <Link
                                to="/login"
                                onClick={fecharMenu}
                                className="w-full text-center py-2.5 rounded-xl bg-ufrn-800 text-white text-sm font-semibold"
                            >
                                Entrar
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
