import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarDays, RefreshCw, Search, Sparkles, Wrench } from 'lucide-react';
import { quadrasApi } from '../services/api';
import { StatusBadge } from './ui/StatusBadge';

export function QuadrasSection() {
    const [quadras, setQuadras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('TODAS');
    const navigate = useNavigate();

    const [reloadTick, setReloadTick] = useState(0);

    const carregarQuadras = useCallback(() => {
        setLoading(true);
        setErro('');
        setReloadTick((t) => t + 1);
    }, []);

    useEffect(() => {
        let cancelado = false;
        quadrasApi.listar()
            .then((dados) => {
                if (!cancelado) {
                    setQuadras(Array.isArray(dados) ? dados : []);
                    setErro('');
                }
            })
            .catch((error) => {
                if (!cancelado) {
                    setErro(error.message || 'Não foi possível carregar o catálogo de quadras.');
                }
            })
            .finally(() => {
                if (!cancelado) setLoading(false);
            });
        return () => {
            cancelado = true;
        };
    }, [reloadTick]);

    const quadrasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return quadras.filter((quadra) => {
            if (filtroStatus === 'DISPONIVEIS' && !quadra.active) return false;
            if (filtroStatus === 'MANUTENCAO' && quadra.active) return false;
            if (!termo) return true;
            return (
                quadra.name?.toLowerCase().includes(termo) ||
                quadra.sport?.toLowerCase().includes(termo) ||
                quadra.description?.toLowerCase().includes(termo)
            );
        });
    }, [quadras, busca, filtroStatus]);

    const totalDisponiveis = quadras.filter((q) => q.active).length;

    let conteudoQuadras;
    if (loading) {
        conteudoQuadras = (
            <div className="space-y-4">
                <p className="text-center text-slate-500 text-sm">Carregando quadras...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="bg-white rounded-2xl border border-sand-200 p-6 h-56 animate-pulse flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="h-5 bg-slate-200 rounded w-2/3" />
                                <div className="h-4 bg-slate-100 rounded w-1/2" />
                                <div className="h-12 bg-slate-100 rounded w-full" />
                            </div>
                            <div className="h-10 bg-slate-200 rounded-xl w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    } else if (erro) {
        conteudoQuadras = (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto">
                <p className="text-sm font-semibold text-rose-700 mb-4">{erro}</p>
                <button
                    type="button"
                    onClick={carregarQuadras}
                    className="inline-flex items-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                    <RefreshCw className="w-4 h-4" />
                    Tentar novamente
                </button>
            </div>
        );
    } else if (quadrasFiltradas.length === 0) {
        conteudoQuadras = (
            <div className="bg-white rounded-2xl border border-sand-200 p-10 text-center">
                <p className="text-slate-700 font-semibold">
                    Nenhuma quadra encontrada para os filtros selecionados.
                </p>
                {busca || filtroStatus !== 'TODAS' ? (
                    <button
                        type="button"
                        onClick={() => {
                            setBusca('');
                            setFiltroStatus('TODAS');
                        }}
                        className="mt-3 text-sm font-semibold text-ufrn-700 hover:underline cursor-pointer"
                    >
                        Limpar filtros
                    </button>
                ) : null}
            </div>
        );
    } else {
        conteudoQuadras = (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quadrasFiltradas.map((quadra) => (
                    <article
                        key={quadra.id}
                        className="bg-white rounded-2xl border border-sand-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-ufrn-600/30 transition-all"
                    >
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                    {quadra.name}
                                </h3>
                                <StatusBadge
                                    status={quadra.active ? 'DISPONIVEL' : 'MANUTENCAO'}
                                />
                            </div>

                            {quadra.sport && (
                                <p className="text-xs font-semibold text-ufrn-700 bg-ufrn-50 inline-block px-2.5 py-1 rounded-lg mb-3">
                                    {quadra.sport}
                                </p>
                            )}

                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                {quadra.description || 'Quadra de areia oficial disponível para agendamentos da comunidade acadêmica da UFRN.'}
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={!quadra.active}
                            onClick={() => navigate(`/quadras/${quadra.id}`)}
                            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600 focus-visible:ring-offset-2 ${
                                quadra.active
                                    ? 'bg-ufrn-800 hover:bg-ufrn-900 text-white shadow-xs cursor-pointer'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {quadra.active ? (
                                <>
                                    <CalendarDays className="w-4 h-4" aria-hidden="true" />
                                    Ver Horários
                                </>
                            ) : (
                                <>
                                    <Wrench className="w-4 h-4" aria-hidden="true" />
                                    Indisponível
                                </>
                            )}
                        </button>
                    </article>
                ))}
            </div>
        );
    }

    return (
        <section id="quadras" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ufrn-700 bg-ufrn-50 px-3 py-1 rounded-full mb-3">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        Catálogo Oficial
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Quadras Disponíveis
                    </h2>
                    <p className="text-slate-600 mt-1.5">
                        Escolha uma quadra para consultar a grade de horários e garantir sua partida.
                    </p>
                </div>

                {!loading && !erro && quadras.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="search"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar quadra ou modalidade..."
                                aria-label="Buscar quadra ou modalidade"
                                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-white border border-sand-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                            />
                        </div>

                        <div className="inline-flex rounded-xl bg-sand-100 p-1 border border-sand-200">
                            {[
                                { id: 'TODAS', label: `Todas (${quadras.length})` },
                                { id: 'DISPONIVEIS', label: `Livres (${totalDisponiveis})` },
                                { id: 'MANUTENCAO', label: 'Manutenção' },
                            ].map((aba) => (
                                <button
                                    key={aba.id}
                                    type="button"
                                    onClick={() => setFiltroStatus(aba.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                        filtroStatus === aba.id
                                            ? 'bg-white text-ufrn-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {aba.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {conteudoQuadras}
        </section>
    );
}
