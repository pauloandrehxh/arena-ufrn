import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
    Calendar,
    CalendarCheck2,
    CalendarClock,
    CalendarPlus,
    Clock,
    Filter,
    History,
    XCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { disponibilidadeApi, quadrasApi, reservasApi } from '../services/api';
import { formatarDataBR, obterAgoraFortaleza, reservaEhFutura } from '../utils/date';

export default function MinhasReservasPage() {
    const { usuario } = useAuth();
    const toast = useToast();

    const [reservas, setReservas] = useState([]);
    const [quadras, setQuadras] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const [filtros, setFiltros] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
    });

    // Modal de cancelamento
    const [reservaCancelar, setReservaCancelar] = useState(null);
    const [cancelando, setCancelando] = useState(false);

    // Modal de reagendamento
    const [reservaReagendar, setReservaReagendar] = useState(null);
    const [reagendarQuadraId, setReagendarQuadraId] = useState('');
    const [reagendarData, setReagendarData] = useState('');
    const [slotsReagendar, setSlotsReagendar] = useState([]);
    const [carregandoSlots, setCarregandoSlots] = useState(false);
    const [slotEscolhido, setSlotEscolhido] = useState(null);
    const [salvandoReagendamento, setSalvandoReagendamento] = useState(false);

    const hojeIso = obterAgoraFortaleza().date;

    const [reloadTick, setReloadTick] = useState(0);

    const carregarReservas = useCallback(() => {
        setCarregando(true);
        setReloadTick((t) => t + 1);
    }, []);

    useEffect(() => {
        let cancelado = false;
        reservasApi.listarMinhas(filtros)
            .then((dados) => {
                if (!cancelado) {
                    setReservas(Array.isArray(dados) ? dados : []);
                    setErro('');
                }
            })
            .catch((error) => {
                if (!cancelado) {
                    setErro(error.message || 'Não foi possível carregar suas reservas.');
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });
        return () => {
            cancelado = true;
        };
    }, [filtros, reloadTick]);

    useEffect(() => {
        quadrasApi.listar().then((lista) => {
            if (Array.isArray(lista)) {
                setQuadras(lista.filter((q) => q.active));
            }
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!reservaReagendar || !reagendarQuadraId || !reagendarData) return;

        let ativo = true;
        disponibilidadeApi
            .consultar({ quadraId: reagendarQuadraId, date: reagendarData })
            .then((dados) => {
                if (!ativo) return;
                const livresFuturos = (dados?.disponiveis || []).filter((slot) =>
                    reservaEhFutura(reagendarData, slot.startTime)
                );
                setSlotsReagendar(livresFuturos);
            })
            .catch(() => {
                if (ativo) setSlotsReagendar([]);
            })
            .finally(() => {
                if (ativo) setCarregandoSlots(false);
            });

        return () => {
            ativo = false;
        };
    }, [reservaReagendar, reagendarQuadraId, reagendarData]);

    const abrirModalReagendar = (reserva) => {
        const dataIso = typeof reserva.date === 'string'
            ? reserva.date.slice(0, 10)
            : new Date(reserva.date).toISOString().slice(0, 10);
        let dataInicialReagendar = hojeIso;
        if (dataIso >= hojeIso) {
            dataInicialReagendar = dataIso;
        }
        setCarregandoSlots(true);
        setReservaReagendar(reserva);
        setReagendarQuadraId(String(reserva.quadraId));
        setReagendarData(dataInicialReagendar);
        setSlotEscolhido(null);
    };

    const confirmarReagendamento = async () => {
        if (!reservaReagendar || !slotEscolhido) return;
        setSalvandoReagendamento(true);
        try {
            await reservasApi.atualizar(reservaReagendar.id, {
                quadraId: Number(reagendarQuadraId),
                date: reagendarData,
                startTime: slotEscolhido.startTime,
                endTime: slotEscolhido.endTime,
            });
            toast.sucesso('Reserva reagendada com sucesso!');
            setReservaReagendar(null);
            carregarReservas();
        } catch (error) {
            toast.erro(error.message || 'Não foi possível reagendar a reserva.');
        } finally {
            setSalvandoReagendamento(false);
        }
    };

    const confirmarCancelamento = async () => {
        if (!reservaCancelar) return;
        setCancelando(true);
        try {
            await reservasApi.cancelar(reservaCancelar.id);
            toast.sucesso('Reserva cancelada. O horário foi liberado para outros usuários.');
            setReservaCancelar(null);
            carregarReservas();
        } catch (error) {
            toast.erro(error.message || 'Erro ao cancelar reserva.');
        } finally {
            setCancelando(false);
        }
    };

    const metricas = useMemo(() => {
        const proximasAtivas = reservas.filter(
            (r) => r.status === 'ATIVA' && reservaEhFutura(r.date, r.startTime)
        ).length;
        const canceladas = reservas.filter((r) => r.status === 'CANCELADA').length;
        return {
            proximasAtivas,
            total: reservas.length,
            canceladas,
        };
    }, [reservas]);

    const temFiltros = Boolean(filtros.status || filtros.dateFrom || filtros.dateTo);

    let conteudoReservas;
    if (carregando) {
        conteudoReservas = (
            <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    } else if (erro) {
        conteudoReservas = (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {erro}
            </div>
        );
    } else if (reservas.length === 0) {
        conteudoReservas = (
            <div className="py-12 text-center">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-800">
                    {temFiltros
                        ? 'Nenhuma reserva encontrada para esses filtros.'
                        : 'Você ainda não possui reservas.'}
                </p>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    Escolha uma quadra disponível e garanta seu próximo jogo na areia.
                </p>
                <Link
                    to="/#quadras"
                    className="inline-flex items-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                >
                    <CalendarPlus className="w-4 h-4" />
                    Explorar Quadras
                </Link>
            </div>
        );
    } else {
        conteudoReservas = (
            <div className="space-y-3">
                {reservas.map((reserva) => {
                    const podeAlterar =
                        reserva.status === 'ATIVA' &&
                        reservaEhFutura(reserva.date, reserva.startTime);

                    return (
                        <article
                            key={reserva.id}
                            className="rounded-2xl border border-sand-200 bg-sand-50/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge status={reserva.status} />
                                    <span className="text-xs font-medium text-slate-400">
                                        #{reserva.id}
                                    </span>
                                </div>
                                <h2 className="text-base font-bold text-slate-900">
                                    {reserva.quadra?.name || `Quadra #${reserva.quadraId}`}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 tabular-nums">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-ufrn-700" />
                                        {formatarDataBR(reserva.date)}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                        {reserva.startTime} – {reserva.endTime}
                                    </span>
                                </div>
                            </div>

                            {podeAlterar ? (
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => abrirModalReagendar(reserva)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-ufrn-700/25 bg-white hover:bg-ufrn-50 text-ufrn-800 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        <CalendarClock className="w-4 h-4" />
                                        Reagendar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReservaCancelar(reserva)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs font-medium text-slate-400">
                                    {reserva.status === 'CANCELADA'
                                        ? 'Horário liberado'
                                        : 'Período já iniciado'}
                                </span>
                            )}
                        </article>
                    );
                })}
            </div>
        );
    }

    let conteudoSlots;
    if (carregandoSlots) {
        conteudoSlots = (
            <p className="text-xs text-slate-500 py-4">Consultando grade de horários...</p>
        );
    } else if (slotsReagendar.length === 0) {
        conteudoSlots = (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                Nenhum horário livre para esta quadra e data. Escolha outra data.
            </p>
        );
    } else {
        conteudoSlots = (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {slotsReagendar.map((slot) => {
                    const ativo =
                        slotEscolhido?.startTime === slot.startTime &&
                        slotEscolhido?.endTime === slot.endTime;
                    return (
                        <button
                            key={slot.startTime}
                            type="button"
                            onClick={() => setSlotEscolhido(slot)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold tabular-nums cursor-pointer transition-colors ${
                                ativo
                                    ? 'bg-ufrn-800 text-white border-ufrn-800'
                                    : 'bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:bg-ufrn-50'
                            }`}
                        >
                            {slot.startTime} – {slot.endTime}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-6">
                <section className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <StatusBadge status={usuario?.role} />
                            <span className="text-xs font-medium text-slate-500">
                                Matrícula {usuario?.registration}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Minhas Reservas
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Acompanhe seus agendamentos, reagende horários ou cancele quando não puder jogar.
                        </p>
                    </div>

                    <Link
                        to="/#quadras"
                        className="inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xs transition-colors shrink-0"
                    >
                        <CalendarPlus className="w-4 h-4" />
                        Nova Reserva
                    </Link>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-sand-200 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <CalendarCheck2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Próximas Ativas</p>
                            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                                {metricas.proximasAtivas}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-sand-200 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-ufrn-50 text-ufrn-700 flex items-center justify-center">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Total no Filtro</p>
                            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                                {metricas.total}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-sand-200 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Canceladas</p>
                            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                                {metricas.canceladas}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-sand-200 p-6 shadow-xs space-y-5">
                    <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Filter className="w-4 h-4 text-ufrn-700" />
                            Filtrar histórico
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label htmlFor="filtro-status" className="block text-xs font-semibold text-slate-500 mb-1">
                                    Situação
                                </label>
                                <select
                                    id="filtro-status"
                                    value={filtros.status}
                                    onChange={(e) => setFiltros((f) => ({ ...f, status: e.target.value }))}
                                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                >
                                    <option value="">Todas</option>
                                    <option value="ATIVA">Ativas</option>
                                    <option value="CANCELADA">Canceladas</option>
                                    <option value="CONCLUIDA">Concluídas</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="filtro-de" className="block text-xs font-semibold text-slate-500 mb-1">
                                    De
                                </label>
                                <input
                                    id="filtro-de"
                                    type="date"
                                    value={filtros.dateFrom}
                                    onChange={(e) => setFiltros((f) => ({ ...f, dateFrom: e.target.value }))}
                                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="filtro-ate" className="block text-xs font-semibold text-slate-500 mb-1">
                                    Até
                                </label>
                                <input
                                    id="filtro-ate"
                                    type="date"
                                    value={filtros.dateTo}
                                    onChange={(e) => setFiltros((f) => ({ ...f, dateTo: e.target.value }))}
                                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                />
                            </div>

                            {temFiltros && (
                                <button
                                    type="button"
                                    onClick={() => setFiltros({ status: '', dateFrom: '', dateTo: '' })}
                                    className="px-3 py-2 rounded-xl text-xs font-semibold text-ufrn-700 hover:bg-ufrn-50 cursor-pointer"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </div>

                    {conteudoReservas}
                </section>
            </main>

            <Modal
                aberto={Boolean(reservaCancelar)}
                onFechar={() => setReservaCancelar(null)}
                titulo="Cancelar reserva?"
                descricao="O registro permanecerá no seu histórico, mas o horário será liberado imediatamente para outros alunos."
            >
                {reservaCancelar && (
                    <div className="space-y-5">
                        <div className="rounded-xl bg-sand-50 border border-sand-200 p-4 text-sm space-y-1">
                            <p className="font-bold text-slate-900">{reservaCancelar.quadra?.name}</p>
                            <p className="text-slate-600 tabular-nums">
                                {formatarDataBR(reservaCancelar.date)} • {reservaCancelar.startTime} às {reservaCancelar.endTime}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setReservaCancelar(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                                Manter reserva
                            </button>
                            <button
                                type="button"
                                disabled={cancelando}
                                onClick={confirmarCancelamento}
                                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
                            >
                                {cancelando ? 'Cancelando...' : 'Confirmar cancelamento'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                aberto={Boolean(reservaReagendar)}
                onFechar={() => setReservaReagendar(null)}
                titulo="Reagendar reserva"
                descricao="Escolha uma nova data e um horário livre. Se ocorrer algum conflito, sua reserva atual será preservada."
                largura="max-w-xl"
            >
                {reservaReagendar && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="reagendar-quadra" className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Quadra
                                </label>
                                <select
                                    id="reagendar-quadra"
                                    value={reagendarQuadraId}
                                    onChange={(e) => {
                                        setCarregandoSlots(true);
                                        setSlotEscolhido(null);
                                        setReagendarQuadraId(e.target.value);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                >
                                    {quadras.map((q) => (
                                        <option key={q.id} value={q.id}>{q.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="reagendar-data" className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Nova Data
                                </label>
                                <input
                                    id="reagendar-data"
                                    type="date"
                                    min={hojeIso}
                                    value={reagendarData}
                                    onChange={(e) => {
                                        setCarregandoSlots(true);
                                        setSlotEscolhido(null);
                                        setReagendarData(e.target.value);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-700 mb-2">
                                Horários livres disponíveis
                            </p>
                            {conteudoSlots}
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setReservaReagendar(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!slotEscolhido || salvandoReagendamento}
                                onClick={confirmarReagendamento}
                                className="px-4 py-2.5 rounded-xl bg-ufrn-800 hover:bg-ufrn-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold cursor-pointer"
                            >
                                {salvandoReagendamento ? 'Salvando...' : 'Salvar novo horário'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Footer />
        </div>
    );
}
