import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Search, UserCheck, UserPlus, UserX } from 'lucide-react';
import { usuariosApi } from '../../services/api';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const FORM_INICIAL = {
    name: '',
    email: '',
    registration: '',
    role: 'ALUNO',
    password: '',
};

function obterClasseBotaoAtivo(ehProprio, ativo) {
    if (ehProprio) {
        return 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400';
    }
    if (ativo) {
        return 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 cursor-pointer';
    }
    return 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 cursor-pointer';
}

export function AdminUsuariosTab({ usuarios, onRecarregar }) {
    const { usuario: gestorLogado } = useAuth();
    const toast = useToast();

    const [busca, setBusca] = useState('');
    const [filtroPapel, setFiltroPapel] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState(FORM_INICIAL);
    const [salvando, setSalvando] = useState(false);

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return usuarios.filter((u) => {
            if (filtroPapel && u.role !== filtroPapel) return false;
            if (!termo) return true;
            return (
                u.name?.toLowerCase().includes(termo) ||
                u.email?.toLowerCase().includes(termo) ||
                u.registration?.toLowerCase().includes(termo)
            );
        });
    }, [usuarios, busca, filtroPapel]);

    const abrirCriar = () => {
        setEditando(null);
        setForm(FORM_INICIAL);
        setModalAberto(true);
    };

    const abrirEditar = (u) => {
        setEditando(u);
        setForm({
            name: u.name,
            email: u.email,
            registration: u.registration,
            role: u.role,
            password: '',
        });
        setModalAberto(true);
    };

    const handleSalvar = async (event) => {
        event.preventDefault();
        setSalvando(true);
        try {
            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                registration: form.registration.trim(),
                role: form.role,
            };
            if (form.password) {
                payload.password = form.password;
            }

            if (editando) {
                await usuariosApi.atualizar(editando.id, payload);
                toast.sucesso('Usuário atualizado com sucesso!');
            } else {
                await usuariosApi.criar(payload);
                toast.sucesso('Usuário cadastrado com sucesso!');
            }
            setModalAberto(false);
            await onRecarregar();
        } catch (error) {
            toast.erro(error.message || 'Erro ao salvar usuário.');
        } finally {
            setSalvando(false);
        }
    };

    const alternarAtivo = async (u) => {
        try {
            await usuariosApi.atualizar(u.id, { active: !u.active });
            toast.sucesso(
                u.active
                    ? `Conta de ${u.name} inativada (histórico preservado).`
                    : `Conta de ${u.name} reativada.`
            );
            await onRecarregar();
        } catch (error) {
            toast.erro(error.message || 'Erro ao alterar situação do usuário.');
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="search"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar nome, e-mail ou matrícula..."
                            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm w-64 focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                        />
                    </div>
                    <select
                        value={filtroPapel}
                        onChange={(e) => setFiltroPapel(e.target.value)}
                        aria-label="Filtrar por perfil"
                        className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700"
                    >
                        <option value="">Todos os perfis</option>
                        <option value="ALUNO">Alunos</option>
                        <option value="GESTOR">Gestores</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={abrirCriar}
                    className="inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Usuário
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-sand-50 border-b border-sand-200 text-xs uppercase tracking-wider text-slate-500">
                                <th className="py-3.5 px-4 font-bold">Usuário</th>
                                <th className="py-3.5 px-4 font-bold">Matrícula</th>
                                <th className="py-3.5 px-4 font-bold">Perfil</th>
                                <th className="py-3.5 px-4 font-bold">Situação</th>
                                <th className="py-3.5 px-4 font-bold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtrados.map((u) => {
                                const ehProprio = u.id === gestorLogado?.id;
                                return (
                                    <tr key={u.id} className="hover:bg-sand-50/50">
                                        <td className="py-3.5 px-4">
                                            <p className="font-bold text-slate-900">
                                                {u.name}{' '}
                                                {ehProprio && (
                                                    <span className="text-[11px] font-semibold text-ufrn-700">(Você)</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </td>
                                        <td className="py-3.5 px-4 tabular-nums font-medium text-slate-700">
                                            {u.registration}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <StatusBadge status={u.role} />
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <StatusBadge status={u.active ? 'ATIVO' : 'INATIVO'} />
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => abrirEditar(u)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={ehProprio}
                                                    onClick={() => alternarAtivo(u)}
                                                    title={ehProprio ? 'Você não pode inativar sua própria conta' : undefined}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${obterClasseBotaoAtivo(ehProprio, u.active)}`}
                                                >
                                                    {u.active ? (
                                                        <>
                                                            <UserX className="w-3.5 h-3.5" />
                                                            Inativar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            Reativar
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                titulo={editando ? 'Editar usuário' : 'Cadastrar usuário'}
            >
                <form onSubmit={handleSalvar} className="space-y-4">
                    <div>
                        <label htmlFor="u-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                            Nome completo
                        </label>
                        <input
                            id="u-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="u-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                                E-mail
                            </label>
                            <input
                                id="u-email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="u-reg" className="block text-xs font-bold text-slate-700 mb-1.5">
                                Matrícula
                            </label>
                            <input
                                id="u-reg"
                                type="text"
                                required
                                value={form.registration}
                                onChange={(e) => setForm((f) => ({ ...f, registration: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="u-role" className="block text-xs font-bold text-slate-700 mb-1.5">
                                Perfil de acesso
                            </label>
                            <select
                                id="u-role"
                                value={form.role}
                                disabled={editando?.id === gestorLogado?.id}
                                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white disabled:bg-slate-100"
                            >
                                <option value="ALUNO">Aluno</option>
                                <option value="GESTOR">Gestor</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="u-pass" className="block text-xs font-bold text-slate-700 mb-1.5">
                                {editando ? 'Nova senha (opcional)' : 'Senha inicial (mín. 6)'}
                            </label>
                            <input
                                id="u-pass"
                                type="password"
                                minLength={6}
                                required={!editando}
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                placeholder={editando ? 'Deixe vazio para manter' : 'Mínimo 6 caracteres'}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                            />
                        </div>
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
        </div>
    );
}

AdminUsuariosTab.propTypes = {
    usuarios: PropTypes.array.isRequired,
    onRecarregar: PropTypes.func.isRequired,
};
