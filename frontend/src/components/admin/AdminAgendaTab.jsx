import { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, Filter, RefreshCw, XCircle } from 'lucide-react';
import { reservasApi } from '../../services/api';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { formatarDataBR, reservaEhFutura } from '../../utils/date';

export function AdminAgendaTab({ quadras, onAtualizarKpis }) {
    const toast = useToast();
    const [reservas, setReservas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtros, setFiltros] = useState({
        quadraId: '',
        status: '',
        dateFrom: '',
        dateTo: '',
    });
    const [reservaCancelar, setReservaCancelar] = useState(null);
    const [cancelando, setCancelando] = useState(false);

    const [reloadTick, setReloadTick] = useState(0);

    const recarregar = useCallback(() => {
        setCarregando(true);
        setReloadTick((t) => t + 1);
    }, []);

    useEffect(() => {
        let cancelado = false;
        reservasApi.listarTodas(filtros)
            .then((dados) => {
                if (!cancelado) {
                    setReservas(Array.isArray(dados) ? dados : []);
                }
            })
            .catch((error) => {
                if (!cancelado) {
                    toast.erro(error.message || 'Erro ao carregar agenda geral.');
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });
        return () => {
            cancelado = true;
        };
    }, [filtros, reloadTick, toast]);

    const confirmarCancelamento = async () => {
        if (!reservaCancelar) return;
        setCancelando(true);
        try {
            await reservasApi.cancelar(reservaCancelar.id);
            toast.sucesso(`Reserva #${reservaCancelar.id} cancelada administrativamente.`);
            setReservaCancelar(null);
            recarregar();
            onAtualizarKpis?.();
        } catch (error) {
            toast.erro(error.message || 'Erro ao cancelar reserva.');
        } finally {
            setCancelando(false);
        }
    };

    const temFiltros = Boolean(filtros.quadraId || filtros.status || filtros.dateFrom || filtros.dateTo);

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-sand-200 p-5 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label htmlFor="adm-quadra" className="block text-xs font-semibold text-slate-500 mb-1">
                            Quadra
                        </label>
                        <select
                            id="adm-quadra"
                            value={filtros.quadraId}
                            onChange={(e) => setFiltros((f) => ({ ...f, quadraId: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        >
                            <option value="">Todas as quadras</option>
                            {quadras.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.name} {!q.active ? '(Manutenção)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="adm-status" className="block text-xs font-semibold text-slate-500 mb-1">
                            Situação
                        </label>
                        <select
                            id="adm-status"
                            value={filtros.status}
                            onChange={(e) => setFiltros((f) => ({ ...f, status: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        >
                            <option value="">Todos</option>
                            <option value="ATIVA">Ativa</option>
                            <option value="CANCELADA">Cancelada</option>
                            <option value="CONCLUIDA">Concluída</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="adm-de" className="block text-xs font-semibold text-slate-500 mb-1">
                            De
                        </label>
                        <input
                            id="adm-de"
                            type="date"
                            value={filtros.dateFrom}
                            onChange={(e) => setFiltros((f) => ({ ...f, dateFrom: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="adm-ate" className="block text-xs font-semibold text-slate-500 mb-1">
                            Até
                        </label>
                        <input
                            id="adm-ate"
                            type="date"
                            value={filtros.dateTo}
                            onChange={(e) => setFiltros((f) => ({ ...f, dateTo: e.target.value }))}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {temFiltros && (
                        <button
                            type="button"
                            onClick={() => setFiltros({ quadraId: '', status: '', dateFrom: '', dateTo: '' })}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-ufrn-700 hover:bg-ufrn-50 cursor-pointer"
                        >
                            Limpar filtros
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={recarregar}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Atualizar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
                {carregando ? (
                    <div className="p-8 text-center text-sm text-slate-500">Carregando agenda...</div>
                ) : reservas.length === 0 ? (
                    <div className="p-10 text-center">
                        <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">
                            Nenhuma reserva encontrada para os filtros selecionados.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-sand-50 border-b border-sand-200 text-xs uppercase tracking-wider text-slate-500">
                                    <th className="py-3.5 px-4 font-bold">Quadra</th>
                                    <th className="py-3.5 px-4 font-bold">Titular</th>
                                    <th className="py-3.5 px-4 font-bold">Data &amp; Horário</th>
                                    <th className="py-3.5 px-4 font-bold">Status</th>
                                    <th className="py-3.5 px-4 font-bold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reservas.map((r) => {
                                    const cancelavel = r.status === 'ATIVA' && reservaEhFutura(r.date, r.startTime);
                                    return (
                                        <tr key={r.id} className="hover:bg-sand-50/50">
                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-slate-900">{r.quadra?.name}</p>
                                                <p className="text-xs text-slate-400">Reserva #{r.id}</p>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <p className="font-semibold text-slate-800">{r.usuario?.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {r.usuario?.registration} • {r.usuario?.email}
                                                </p>
                                            </td>
                                            <td className="py-3.5 px-4 tabular-nums">
                                                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                                                    <Calendar className="w-3.5 h-3.5 text-ufrn-700" />
                                                    {formatarDataBR(r.date)}
                                                </span>
                                                <span className="block text-xs text-slate-600 mt-0.5 inline-flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {r.startTime} – {r.endTime}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {cancelavel ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setReservaCancelar(r)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Cancelar
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                aberto={Boolean(reservaCancelar)}
                onFechar={() => setReservaCancelar(null)}
                titulo="Cancelamento administrativo"
                descricao="Esta ação cancelará logicamente a reserva e liberará o horário imediatamente."
            >
                {reservaCancelar && (
                    <div className="space-y-5">
                        <div className="rounded-xl bg-sand-50 border border-sand-200 p-4 text-sm space-y-1">
                            <p className="font-bold text-slate-900">{reservaCancelar.quadra?.name}</p>
                            <p className="text-slate-600">Titular: {reservaCancelar.usuario?.name}</p>
                            <p className="text-slate-600 tabular-nums">
                                {formatarDataBR(reservaCancelar.date)} • {reservaCancelar.startTime} – {reservaCancelar.endTime}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setReservaCancelar(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer"
                            >
                                Voltar
                            </button>
                            <button
                                type="button"
                                disabled={cancelando}
                                onClick={confirmarCancelamento}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer"
                            >
                                {cancelando ? 'Cancelando...' : 'Confirmar cancelamento'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
