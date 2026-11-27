import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, LayoutGrid, ShieldCheck, Users, Wrench } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AdminAgendaTab } from '../components/admin/AdminAgendaTab';
import { AdminQuadrasTab } from '../components/admin/AdminQuadrasTab';
import { AdminUsuariosTab } from '../components/admin/AdminUsuariosTab';
import { quadrasApi, reservasApi, usuariosApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { reservaEhFutura } from '../utils/date';

export default function AdminPage() {
    const { usuario } = useAuth();
    const toast = useToast();
    const [abaAtiva, setAbaAtiva] = useState('agenda');
    const [quadras, setQuadras] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [reservasAtivasFuturas, setReservasAtivasFuturas] = useState(0);
    const [carregando, setCarregando] = useState(true);

    const [reloadTick, setReloadTick] = useState(0);

    const carregarResumo = useCallback(() => {
        setReloadTick((t) => t + 1);
    }, []);

    useEffect(() => {
        let cancelado = false;
        Promise.all([
            quadrasApi.listar(),
            usuariosApi.listar(),
            reservasApi.listarTodas({ status: 'ATIVA' }),
        ])
            .then(([listaQuadras, listaUsuarios, listaReservas]) => {
                if (cancelado) return;
                setQuadras(Array.isArray(listaQuadras) ? listaQuadras : []);
                setUsuarios(Array.isArray(listaUsuarios) ? listaUsuarios : []);
                setReservasAtivasFuturas(
                    Array.isArray(listaReservas)
                        ? listaReservas.filter((r) => reservaEhFutura(r.date, r.startTime)).length
                        : 0
                );
            })
            .catch((error) => {
                if (!cancelado) {
                    toast.erro(error.message || 'Erro ao carregar dados administrativos.');
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });
        return () => {
            cancelado = true;
        };
    }, [reloadTick, toast]);

    const quadrasAtivas = quadras.filter((q) => q.active).length;
    const quadrasManutencao = quadras.length - quadrasAtivas;
    const usuariosAtivos = usuarios.filter((u) => u.active).length;

    const abas = [
        { id: 'agenda', label: 'Agenda Geral', icone: CalendarDays },
        { id: 'quadras', label: `Quadras (${quadras.length})`, icone: LayoutGrid },
        { id: 'usuarios', label: `Usuários (${usuarios.length})`, icone: Users },
    ];

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-6">
                <section className="bg-gradient-to-r from-ufrn-950 via-ufrn-900 to-ufrn-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full mb-3">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Área Restrita • Gestor Esportivo
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Painel Administrativo
                            </h1>
                            <p className="text-sm text-blue-100/90 mt-1">
                                Olá, <strong>{usuario?.name}</strong>. Gerencie quadras, usuários e a agenda completa da Arena UFRN.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
                            <p className="text-xs text-blue-200 font-medium">Reservas Ativas Futuras</p>
                            <p className="text-2xl font-extrabold mt-1 tabular-nums">{reservasAtivasFuturas}</p>
                        </div>
                        <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
                            <p className="text-xs text-blue-200 font-medium">Quadras Disponíveis</p>
                            <p className="text-2xl font-extrabold mt-1 tabular-nums text-emerald-300">
                                {quadrasAtivas}
                            </p>
                        </div>
                        <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
                            <p className="text-xs text-blue-200 font-medium flex items-center gap-1">
                                <Wrench className="w-3.5 h-3.5 text-amber-300" />
                                Em Manutenção
                            </p>
                            <p className="text-2xl font-extrabold mt-1 tabular-nums text-amber-300">
                                {quadrasManutencao}
                            </p>
                        </div>
                        <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
                            <p className="text-xs text-blue-200 font-medium">Usuários Ativos</p>
                            <p className="text-2xl font-extrabold mt-1 tabular-nums">{usuariosAtivos}</p>
                        </div>
                    </div>
                </section>

                <div
                    role="tablist"
                    aria-label="Módulos administrativos"
                    className="inline-flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-sand-200 shadow-xs"
                >
                    {abas.map((aba) => {
                        const Icone = aba.icone;
                        const selecionada = abaAtiva === aba.id;
                        return (
                            <button
                                key={aba.id}
                                type="button"
                                role="tab"
                                aria-selected={selecionada}
                                onClick={() => setAbaAtiva(aba.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                                    selecionada
                                        ? 'bg-ufrn-800 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-sand-100 hover:text-slate-900'
                                }`}
                            >
                                <Icone className="w-4 h-4" />
                                {aba.label}
                            </button>
                        );
                    })}
                </div>

                {carregando ? (
                    <div className="bg-white rounded-2xl border border-sand-200 p-10 text-center text-sm text-slate-500">
                        Carregando painel administrativo...
                    </div>
                ) : (
                    <>
                        {abaAtiva === 'agenda' && (
                            <AdminAgendaTab quadras={quadras} onAtualizarKpis={carregarResumo} />
                        )}
                        {abaAtiva === 'quadras' && (
                            <AdminQuadrasTab quadras={quadras} onRecarregar={carregarResumo} />
                        )}
                        {abaAtiva === 'usuarios' && (
                            <AdminUsuariosTab usuarios={usuarios} onRecarregar={carregarResumo} />
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
