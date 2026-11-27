import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, Sun } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

function destinoSeguro(raw) {
    if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
        return raw;
    }
    return null;
}

export default function LoginPage() {
    const { login, autenticado, ehGestor } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    const redirectParam = destinoSeguro(searchParams.get('redirect'));

    if (autenticado) {
        return <Navigate to={redirectParam || (ehGestor ? '/admin' : '/minhas-reservas')} replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErro('');

        if (!identifier.trim() || !password) {
            setErro('Preencha seu e-mail ou matrícula e sua senha.');
            return;
        }

        setEnviando(true);
        try {
            const user = await login({ identifier: identifier.trim(), password });
            toast.sucesso(`Bem-vindo(a), ${user.name.split(' ')[0]}!`);
            const destino = redirectParam || (user.role === 'GESTOR' ? '/admin' : '/minhas-reservas');
            navigate(destino, { replace: true });
        } catch (error) {
            setErro(error.message || 'Não foi possível entrar. Verifique suas credenciais.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-sand-200 shadow-xl overflow-hidden">
                    <div className="lg:col-span-5 bg-gradient-to-br from-ufrn-950 via-ufrn-900 to-ufrn-700 text-white p-8 sm:p-10 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold text-amber-200 mb-6">
                                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                                Comunidade UFRN
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                                Acesse sua conta na Arena UFRN
                            </h1>
                            <p className="text-sm text-blue-100/90 mt-4 leading-relaxed">
                                Reserve quadras de areia, acompanhe seus horários ativos, reagende ou cancele em poucos cliques.
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/15 space-y-3 text-xs text-blue-100/90">
                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                <p>
                                    <strong className="text-white">Acesso por perfil:</strong> alunos gerenciam suas próprias reservas; gestores acessam o painel administrativo restrito.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 p-8 sm:p-10">
                        <div className="mb-6">
                            <h2 className="text-xl font-extrabold text-slate-900">Entrar</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Use seu e-mail ou matrícula cadastrada.
                            </p>
                        </div>

                        {erro && (
                            <div
                                role="alert"
                                className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 font-medium"
                            >
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="login-identifier"
                                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                                >
                                    E-mail ou Matrícula
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="login-identifier"
                                        type="text"
                                        autoComplete="username"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="ex.: aluno@ufrn.br ou 202600001"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ufrn-600 focus:border-ufrn-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="login-password"
                                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                                >
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="login-password"
                                        type={mostrarSenha ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Digite sua senha"
                                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ufrn-600 focus:border-ufrn-600"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha((v) => !v)}
                                        aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                                    >
                                        {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={enviando}
                                className="w-full inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 disabled:bg-ufrn-800/60 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
                            >
                                <LogIn className="w-4 h-4" aria-hidden="true" />
                                {enviando ? 'Entrando...' : 'Entrar na plataforma'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600">
                            Ainda não tem conta?{' '}
                            <Link
                                to={redirectParam ? `/cadastro?redirect=${encodeURIComponent(redirectParam)}` : '/cadastro'}
                                className="font-bold text-ufrn-700 hover:text-ufrn-900 underline underline-offset-2"
                            >
                                Criar cadastro de aluno
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
