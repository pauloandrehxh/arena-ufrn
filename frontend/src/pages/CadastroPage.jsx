import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { Hash, Lock, Mail, User, UserPlus } from 'lucide-react';
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

export default function CadastroPage() {
    const { registrar, autenticado } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [form, setForm] = useState({
        name: '',
        email: '',
        registration: '',
        password: '',
        confirmPassword: '',
    });
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    const redirectParam = destinoSeguro(searchParams.get('redirect'));

    if (autenticado) {
        return <Navigate to={redirectParam || '/minhas-reservas'} replace />;
    }

    const atualizarCampo = (campo) => (event) => {
        setForm((prev) => ({ ...prev, [campo]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErro('');

        if (form.password.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setErro('A confirmação de senha não confere.');
            return;
        }

        setEnviando(true);
        try {
            const user = await registrar({
                name: form.name.trim(),
                email: form.email.trim(),
                registration: form.registration.trim(),
                password: form.password,
            });
            toast.sucesso(`Conta criada! Bem-vindo(a), ${user.name.split(' ')[0]}.`);
            navigate(redirectParam || '/minhas-reservas', { replace: true });
        } catch (error) {
            setErro(error.message || 'Erro ao concluir o cadastro.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg bg-white rounded-3xl border border-sand-200 shadow-xl p-8 sm:p-10">
                    <div className="mb-6">
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-ufrn-700 bg-ufrn-50 px-3 py-1 rounded-full mb-3">
                            Cadastro de Aluno
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900">
                            Crie sua conta na Arena UFRN
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Com sua conta você pode reservar horários e gerenciar suas partidas.
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
                            <label htmlFor="cad-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Nome completo
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="cad-name"
                                    type="text"
                                    value={form.name}
                                    onChange={atualizarCampo('name')}
                                    placeholder="Seu nome completo"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cad-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    E-mail
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="cad-email"
                                        type="email"
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={atualizarCampo('email')}
                                        placeholder="voce@ufrn.br"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="cad-reg" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Matrícula UFRN
                                </label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="cad-reg"
                                        type="text"
                                        value={form.registration}
                                        onChange={atualizarCampo('registration')}
                                        placeholder="202612345"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cad-pass" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="cad-pass"
                                        type="password"
                                        autoComplete="new-password"
                                        value={form.password}
                                        onChange={atualizarCampo('password')}
                                        placeholder="Mín. 6 caracteres"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="cad-confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Confirmar senha
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="cad-confirm"
                                        type="password"
                                        autoComplete="new-password"
                                        value={form.confirmPassword}
                                        onChange={atualizarCampo('confirmPassword')}
                                        placeholder="Repita a senha"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={enviando}
                            className="w-full inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 disabled:bg-ufrn-800/60 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer mt-2"
                        >
                            <UserPlus className="w-4 h-4" aria-hidden="true" />
                            {enviando ? 'Criando conta...' : 'Criar conta e continuar'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Já possui cadastro?{' '}
                        <Link
                            to={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
                            className="font-bold text-ufrn-700 hover:text-ufrn-900 underline underline-offset-2"
                        >
                            Entrar agora
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
