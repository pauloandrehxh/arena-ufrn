import { Link, Navigate, useLocation } from 'react-router';
import { ShieldAlert, ArrowLeft, CalendarCheck2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

export function ProtectedRoute({ children, allowedRoles }) {
    const { usuario, carregando, autenticado } = useAuth();
    const location = useLocation();

    if (carregando) {
        return (
            <div className="min-h-screen bg-sand-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 border-4 border-ufrn-700/20 border-t-ufrn-700 rounded-full animate-spin" />
                        <p className="text-sm font-medium">Verificando sessão...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!autenticado) {
        const destino = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(destino)}`} replace />;
    }

    if (Array.isArray(allowedRoles) && !allowedRoles.includes(usuario.role)) {
        return (
            <div className="min-h-screen bg-sand-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5">
                            <ShieldAlert className="w-7 h-7" aria-hidden="true" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
                            Acesso Restrito • 403
                        </p>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
                            Área exclusiva para gestores
                        </h1>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            Sua conta (<strong>{usuario.email}</strong>) possui perfil de <strong>Aluno</strong>. Para acessar o painel administrativo, entre com uma conta de Gestor Esportivo da UFRN.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/minhas-reservas"
                                className="inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                            >
                                <CalendarCheck2 className="w-4 h-4" />
                                Minhas Reservas
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar ao Início
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return children;
}
