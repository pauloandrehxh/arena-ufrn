import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    LogIn,
    Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { disponibilidadeApi, quadrasApi, reservasApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
    formatarDataExtenso,
    gerarProximosDias,
    obterAgoraFortaleza,
    reservaEhFutura,
} from '../utils/date';

const SKELETON_SLOTS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

function formatarMinutos(min) {
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

function calcularEstadoSlot(ocupado, passado) {
    if (ocupado) return 'OCUPADO';
    if (passado) return 'PASSADO';
    return 'LIVRE';
}

function calcularGradeHorarios(disponibilidade, dataSelecionada) {
    if (!disponibilidade) return [];
    const { inicio, fim, duracaoMinutos } = disponibilidade.horarioFuncionamento;
    const [ih, im] = inicio.split(':').map(Number);
    const [fh, fm] = fim.split(':').map(Number);
    const inicioMin = ih * 60 + im;
    const fimMin = fh * 60 + fm;

    const ocupacoes = disponibilidade.ocupacoes || [];
    const livresSet = new Set(
        (disponibilidade.disponiveis || []).map((s) => `${s.startTime}-${s.endTime}`)
    );

    const slots = [];
    for (let m = inicioMin; m + duracaoMinutos <= fimMin; m += duracaoMinutos) {
        const startTime = formatarMinutos(m);
        const endTime = formatarMinutos(m + duracaoMinutos);
        const chave = `${startTime}-${endTime}`;
        const ocupado = !livresSet.has(chave) || ocupacoes.some(
            (o) => o.startTime < endTime && startTime < o.endTime
        );
        const passado = !reservaEhFutura(dataSelecionada, startTime);

        slots.push({
            startTime,
            endTime,
            estado: calcularEstadoSlot(ocupado, passado),
        });
    }
    return slots;
}

function obterEstiloSlot(slot, selecionado) {
    if (selecionado) {
        return {
            classes: 'bg-ufrn-800 border-ufrn-800 text-white shadow-md ring-2 ring-ufrn-600/30 cursor-pointer',
            rotulo: 'Selecionado',
        };
    }
    if (slot.estado === 'OCUPADO') {
        return {
            classes: 'bg-rose-50/70 border-rose-200 text-rose-400 cursor-not-allowed',
            rotulo: 'Ocupado',
        };
    }
    if (slot.estado === 'PASSADO') {
        return {
            classes: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed',
            rotulo: 'Encerrado',
        };
    }
    return {
        classes: 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:border-ufrn-700 hover:bg-ufrn-50 cursor-pointer',
        rotulo: 'Livre',
    };
}

function criarUrlLoginQuadra(quadraId, dataSelecionada) {
    const destino = `/quadras/${quadraId}?date=${dataSelecionada}`;
    return `/login?redirect=${encodeURIComponent(destino)}`;
}

function GradeHorariosConteudo({
    carregandoHorarios,
    erroHorarios,
    gradeHorarios,
    slotSelecionado,
    onSelecionarSlot,
}) {
    if (carregandoHorarios) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SKELETON_SLOTS.map((slotKey) => (
                    <div key={slotKey} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (erroHorarios) {
        return (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {erroHorarios}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gradeHorarios.map((slot) => {
                const selecionado =
                    slotSelecionado?.startTime === slot.startTime &&
                    slotSelecionado?.endTime === slot.endTime;
                const desabilitado = slot.estado !== 'LIVRE';
                const { classes, rotulo } = obterEstiloSlot(slot, selecionado);

                return (
                    <button
                        key={slot.startTime}
                        type="button"
                        disabled={desabilitado}
                        onClick={() => onSelecionarSlot(slot)}
                        className={`p-3 rounded-2xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600 ${classes}`}
                    >
                        <span className="block text-sm font-extrabold tabular-nums">
                            {slot.startTime} – {slot.endTime}
                        </span>
                        <span className={`block text-[11px] font-semibold mt-0.5 ${selecionado ? 'text-amber-200' : ''}`}>
                            {rotulo}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

GradeHorariosConteudo.propTypes = {
    carregandoHorarios: PropTypes.bool.isRequired,
    erroHorarios: PropTypes.string,
    gradeHorarios: PropTypes.array.isRequired,
    slotSelecionado: PropTypes.object,
    onSelecionarSlot: PropTypes.func.isRequired,
};

function ResumoReservaSidebar({
    quadra,
    dataSelecionada,
    slotSelecionado,
    autenticado,
    usuario,
    confirmando,
    reservaConfirmada,
    onConfirmar,
}) {
    const urlLogin = criarUrlLoginQuadra(quadra.id, dataSelecionada);

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Resumo da Reserva
                </h2>

                <dl className="space-y-3 text-sm pb-5 border-b border-slate-100">
                    <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Quadra</dt>
                        <dd className="font-bold text-slate-900 text-right">{quadra.name}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Data</dt>
                        <dd className="font-semibold text-slate-900 tabular-nums">
                            {dataSelecionada.split('-').reverse().join('/')}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Horário</dt>
                        <dd className="font-bold text-ufrn-800 tabular-nums">
                            {slotSelecionado
                                ? `${slotSelecionado.startTime} às ${slotSelecionado.endTime}`
                                : 'Selecione um bloco'}
                        </dd>
                    </div>
                    {autenticado && (
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Titular</dt>
                            <dd className="font-semibold text-slate-800 text-right truncate max-w-[180px]">
                                {usuario.name}
                            </dd>
                        </div>
                    )}
                </dl>

                <div className="mt-5">
                    {autenticado ? (
                        <button
                            type="button"
                            disabled={!slotSelecionado || confirmando}
                            onClick={onConfirmar}
                            className="w-full inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {confirmando ? 'Confirmando...' : 'Confirmar Reserva'}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Para confirmar seu horário, faça login ou crie sua conta de aluno.
                            </p>
                            <Link
                                to={urlLogin}
                                className="w-full inline-flex items-center justify-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Entrar para Reservar
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {reservaConfirmada && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold text-emerald-950">Reserva confirmada!</p>
                            <p className="text-emerald-900/90 text-xs mt-1">
                                Horário {reservaConfirmada.startTime}–{reservaConfirmada.endTime} garantido.
                            </p>
                            <Link
                                to="/minhas-reservas"
                                className="inline-block mt-3 text-xs font-bold text-emerald-800 underline underline-offset-2"
                            >
                                Ir para Minhas Reservas →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

ResumoReservaSidebar.propTypes = {
    quadra: PropTypes.object.isRequired,
    dataSelecionada: PropTypes.string.isRequired,
    slotSelecionado: PropTypes.object,
    autenticado: PropTypes.bool.isRequired,
    usuario: PropTypes.object,
    confirmando: PropTypes.bool.isRequired,
    reservaConfirmada: PropTypes.object,
    onConfirmar: PropTypes.func.isRequired,
};

export default function QuadraReservaPage() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { autenticado, usuario } = useAuth();
    const toast = useToast();

    const proximosDias = useMemo(() => gerarProximosDias(14), []);
    const hojeIso = proximosDias[0].iso;
    const dataInicial = searchParams.get('date') || hojeIso;

    const [quadra, setQuadra] = useState(null);
    const [carregandoQuadra, setCarregandoQuadra] = useState(true);
    const [erroQuadra, setErroQuadra] = useState('');

    const [dataSelecionada, setDataSelecionada] = useState(dataInicial);
    const [disponibilidade, setDisponibilidade] = useState(null);
    const [carregandoHorarios, setCarregandoHorarios] = useState(false);
    const [erroHorarios, setErroHorarios] = useState('');

    const [slotSelecionado, setSlotSelecionado] = useState(null);
    const [confirmando, setConfirmando] = useState(false);
    const [reservaConfirmada, setReservaConfirmada] = useState(null);

    const [disponibilidadeTick, setDisponibilidadeTick] = useState(0);

    const recarregarDisponibilidade = useCallback(() => {
        setCarregandoHorarios(true);
        setDisponibilidadeTick((t) => t + 1);
    }, []);

    useEffect(() => {
        let cancelado = false;
        quadrasApi.buscarPorId(id)
            .then((dados) => {
                if (!cancelado) {
                    setQuadra(dados);
                    setErroQuadra('');
                }
            })
            .catch((error) => {
                if (!cancelado) {
                    setErroQuadra(error.message || 'Quadra não encontrada.');
                }
            })
            .finally(() => {
                if (!cancelado) setCarregandoQuadra(false);
            });
        return () => {
            cancelado = true;
        };
    }, [id]);

    useEffect(() => {
        if (!quadra?.active) return;

        let cancelado = false;
        disponibilidadeApi.consultar({
            quadraId: quadra.id,
            date: dataSelecionada,
        })
            .then((dados) => {
                if (!cancelado) {
                    setDisponibilidade(dados);
                    setErroHorarios('');
                }
            })
            .catch((error) => {
                if (!cancelado) {
                    setErroHorarios(error.message || 'Não foi possível consultar a disponibilidade.');
                    setDisponibilidade(null);
                }
            })
            .finally(() => {
                if (!cancelado) setCarregandoHorarios(false);
            });
        return () => {
            cancelado = true;
        };
    }, [quadra, dataSelecionada, disponibilidadeTick]);

    const selecionarData = (novaData) => {
        setCarregandoHorarios(true);
        setSlotSelecionado(null);
        setDataSelecionada(novaData);
        setReservaConfirmada(null);
        setSearchParams({ date: novaData }, { replace: true });
    };

    const gradeHorarios = useMemo(
        () => calcularGradeHorarios(disponibilidade, dataSelecionada),
        [disponibilidade, dataSelecionada]
    );

    const handleConfirmarReserva = async () => {
        if (!slotSelecionado || !quadra) return;

        if (!autenticado) {
            navigate(criarUrlLoginQuadra(quadra.id, dataSelecionada));
            return;
        }

        setConfirmando(true);
        try {
            const criada = await reservasApi.criar({
                quadraId: quadra.id,
                date: dataSelecionada,
                startTime: slotSelecionado.startTime,
                endTime: slotSelecionado.endTime,
            });
            setReservaConfirmada(criada);
            setSlotSelecionado(null);
            toast.sucesso('Reserva confirmada com sucesso!');
            recarregarDisponibilidade();
        } catch (error) {
            toast.erro(error.message || 'Não foi possível concluir a reserva.');
        } finally {
            setConfirmando(false);
        }
    };

    const agoraFortaleza = obterAgoraFortaleza();

    let conteudoPagina;
    if (carregandoQuadra) {
        conteudoPagina = (
            <div className="bg-white rounded-2xl border border-sand-200 p-8 animate-pulse space-y-4">
                <div className="h-7 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
        );
    } else if (erroQuadra || !quadra) {
        conteudoPagina = (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center">
                <p className="text-rose-700 font-semibold mb-4">{erroQuadra || 'Quadra não encontrada.'}</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-ufrn-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                >
                    Ir para o início
                </Link>
            </div>
        );
    } else {
        conteudoPagina = (
            <div className="space-y-6">
                <section className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                                <StatusBadge status={quadra.active ? 'DISPONIVEL' : 'MANUTENCAO'} />
                                {quadra.sport && (
                                    <span className="text-xs font-semibold text-ufrn-700 bg-ufrn-50 px-2.5 py-0.5 rounded-full">
                                        {quadra.sport}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {quadra.name}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
                                {quadra.description || 'Quadra de areia oficial disponível para agendamentos da UFRN.'}
                            </p>
                        </div>
                        <div className="text-xs text-slate-500 bg-sand-50 border border-sand-200 rounded-xl px-3.5 py-2.5">
                            <p className="font-semibold text-slate-700">Horário local (Fortaleza)</p>
                            <p className="tabular-nums mt-0.5">Hoje: {agoraFortaleza.date.split('-').reverse().join('/')} • {agoraFortaleza.time}</p>
                        </div>
                    </div>
                </section>

                {quadra.active ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <section className="bg-white rounded-3xl border border-sand-200 p-6 shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-ufrn-700" />
                                        1. Selecione a data
                                    </h2>
                                    <input
                                        type="date"
                                        min={hojeIso}
                                        value={dataSelecionada}
                                        onChange={(e) => {
                                            if (e.target.value) selecionarData(e.target.value);
                                        }}
                                        aria-label="Escolher outra data"
                                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-ufrn-600"
                                    />
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {proximosDias.map((dia) => {
                                        const ativo = dia.iso === dataSelecionada;
                                        return (
                                            <button
                                                key={dia.iso}
                                                type="button"
                                                onClick={() => selecionarData(dia.iso)}
                                                className={`shrink-0 w-[72px] py-2.5 px-2 rounded-2xl border text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ufrn-600 ${
                                                    ativo
                                                        ? 'bg-ufrn-800 text-white border-ufrn-800 shadow-sm'
                                                        : 'bg-sand-50/70 text-slate-700 border-sand-200 hover:border-ufrn-600/40'
                                                }`}
                                            >
                                                <span className={`block text-[11px] font-semibold ${ativo ? 'text-amber-200' : 'text-slate-500'}`}>
                                                    {dia.diaSemana}
                                                </span>
                                                <span className="block text-lg font-extrabold leading-tight my-0.5 tabular-nums">
                                                    {dia.diaMes}
                                                </span>
                                                <span className={`block text-[11px] uppercase ${ativo ? 'text-blue-200' : 'text-slate-400'}`}>
                                                    {dia.mesCurto}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="bg-white rounded-3xl border border-sand-200 p-6 shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-ufrn-700" />
                                            2. Escolha o horário
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5 capitalize">
                                            {formatarDataExtenso(dataSelecionada)}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            <span>Livre</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                            <span>Ocupado</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                            <span>Encerrado</span>
                                        </span>
                                    </div>
                                </div>

                                <GradeHorariosConteudo
                                    carregandoHorarios={carregandoHorarios}
                                    erroHorarios={erroHorarios}
                                    gradeHorarios={gradeHorarios}
                                    slotSelecionado={slotSelecionado}
                                    onSelecionarSlot={setSlotSelecionado}
                                />
                            </section>
                        </div>

                        <ResumoReservaSidebar
                            quadra={quadra}
                            dataSelecionada={dataSelecionada}
                            slotSelecionado={slotSelecionado}
                            autenticado={autenticado}
                            usuario={usuario}
                            confirmando={confirmando}
                            reservaConfirmada={reservaConfirmada}
                            onConfirmar={handleConfirmarReserva}
                        />
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-3.5">
                        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-base font-bold text-amber-950">
                                Quadra temporariamente em manutenção
                            </h2>
                            <p className="text-sm text-amber-900/90 mt-1">
                                Novos agendamentos estão suspensos para esta quadra no momento. Escolha outra quadra ativa no catálogo.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
                <Link
                    to="/#quadras"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-ufrn-800 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para as quadras
                </Link>

                {conteudoPagina}
            </main>

            <Footer />
        </div>
    );
}
