import { useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { quadrasApi } from '../../services/api';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { useToast } from '../../contexts/ToastContext';

const FORM_INICIAL = {
    name: '',
    sport: 'Vôlei de Praia / Futevôlei / Beach Tennis',
    description: '',
};

export function AdminQuadrasTab({ quadras, onRecarregar }) {
    const toast = useToast();
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState(FORM_INICIAL);
    const [salvando, setSalvando] = useState(false);

    const [quadraExcluir, setQuadraExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const abrirCriar = () => {
        setEditando(null);
        setForm(FORM_INICIAL);
        setModalAberto(true);
    };

    const abrirEditar = (quadra) => {
        setEditando(quadra);
        setForm({
            name: quadra.name || '',
            sport: quadra.sport || '',
            description: quadra.description || '',
        });
        setModalAberto(true);
    };

    const handleSalvar = async (event) => {
        event.preventDefault();
        setSalvando(true);
        try {
            if (editando) {
                await quadrasApi.atualizar(editando.id, form);
                toast.sucesso('Quadra atualizada com sucesso!');
            } else {
                await quadrasApi.criar(form);
                toast.sucesso('Nova quadra cadastrada!');
            }
            setModalAberto(false);
            await onRecarregar();
        } catch (error) {
            toast.erro(error.message || 'Erro ao salvar quadra.');
        } finally {
            setSalvando(false);
        }
    };

    const alternarStatus = async (quadra) => {
        const novoStatus = !quadra.active;
        try {
            await quadrasApi.alterarStatus(quadra.id, novoStatus);
            toast.sucesso(
                novoStatus
                    ? `${quadra.name} reativada para agendamentos.`
                    : `${quadra.name} colocada em manutenção (novas reservas bloqueadas).`
            );
            await onRecarregar();
        } catch (error) {
            toast.erro(error.message || 'Não foi possível alterar o status da quadra.');
        }
    };

    const confirmarExclusao = async () => {
        if (!quadraExcluir) return;
        setExcluindo(true);
        try {
            await quadrasApi.deletar(quadraExcluir.id);
            toast.sucesso('Quadra removida do catálogo.');
            setQuadraExcluir(null);
            await onRecarregar();
        } catch (error) {
            toast.erro(error.message || 'Não foi possível excluir a quadra.');
        } finally {
            setExcluindo(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Catálogo de Quadras</h2>
                    <p className="text-xs text-slate-500">
                        Cadastre novas quadras, edite detalhes ou suspenda temporariamente para manutenção.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriar}
                    className="inline-flex items-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Nova Quadra
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quadras.map((q) => (
                    <article
                        key={q.id}
                        className="bg-white rounded-2xl border border-sand-200 p-5 flex flex-col justify-between gap-4 shadow-xs"
                    >
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">{q.name}</h3>
                                    {q.sport && (
                                        <p className="text-xs font-semibold text-ufrn-700 mt-0.5">{q.sport}</p>
                                    )}
                                </div>
                                <StatusBadge status={q.active ? 'DISPONIVEL' : 'MANUTENCAO'} />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {q.description || 'Sem descrição cadastrada.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => alternarStatus(q)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                    q.active
                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}
                            >
                                <Power className="w-3.5 h-3.5" />
                                {q.active ? 'Colocar em Manutenção' : 'Reativar Quadra'}
                            </button>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => abrirEditar(q)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setQuadraExcluir(q)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <Modal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                titulo={editando ? 'Editar quadra' : 'Cadastrar nova quadra'}
            >
                <form onSubmit={handleSalvar} className="space-y-4">
                    <div>
                        <label htmlFor="q-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                            Nome da quadra
                        </label>
                        <input
                            id="q-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Ex.: Quadra de Areia 4 — Norte"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="q-sport" className="block text-xs font-bold text-slate-700 mb-1.5">
                            Modalidades
                        </label>
                        <input
                            id="q-sport"
                            type="text"
                            value={form.sport}
                            onChange={(e) => setForm((f) => ({ ...f, sport: e.target.value }))}
                            placeholder="Ex.: Beach Tennis e Vôlei de Praia"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="q-desc" className="block text-xs font-bold text-slate-700 mb-1.5">
                            Descrição
                        </label>
                        <textarea
                            id="q-desc"
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Detalhes de estrutura, iluminação, localização..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalAberto(false)}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={salvando}
                            className="px-4 py-2 rounded-xl bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold cursor-pointer"
                        >
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                aberto={Boolean(quadraExcluir)}
                onFechar={() => setQuadraExcluir(null)}
                titulo="Excluir quadra?"
                descricao="Quadras com reservas vinculadas não podem ser removidas para preservar o histórico. Nesse caso, utilize a opção de Manutenção."
            >
                {quadraExcluir && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-700">
                            Deseja excluir permanentemente <strong>{quadraExcluir.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setQuadraExcluir(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={excluindo}
                                onClick={confirmarExclusao}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer"
                            >
                                {excluindo ? 'Excluindo...' : 'Excluir quadra'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

AdminQuadrasTab.propTypes = {
    quadras: PropTypes.array.isRequired,
    onRecarregar: PropTypes.func.isRequired,
};
