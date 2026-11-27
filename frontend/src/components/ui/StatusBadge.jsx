import PropTypes from 'prop-types';

const CONFIG = {
    ATIVA: { label: 'Ativa', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    CANCELADA: { label: 'Cancelada', classes: 'bg-rose-50 text-rose-800 border-rose-200' },
    CONCLUIDA: { label: 'Concluída', classes: 'bg-slate-100 text-slate-700 border-slate-200' },
    DISPONIVEL: { label: 'Disponível', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    MANUTENCAO: { label: 'Em Manutenção', classes: 'bg-amber-50 text-amber-900 border-amber-200' },
    ALUNO: { label: 'Aluno', classes: 'bg-sky-50 text-sky-800 border-sky-200' },
    GESTOR: { label: 'Gestor', classes: 'bg-ufrn-50 text-ufrn-800 border-ufrn-200' },
    ATIVO: { label: 'Ativo', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    INATIVO: { label: 'Inativo', classes: 'bg-rose-50 text-rose-800 border-rose-200' },
};

export function StatusBadge({ status, label }) {
    const info = CONFIG[status] ?? {
        label: status,
        classes: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${info.classes}`}
        >
            {label ?? info.label}
        </span>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.string,
    label: PropTypes.string,
};
