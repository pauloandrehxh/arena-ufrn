import { Link } from 'react-router';
import { ArrowRight, CalendarCheck2, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function HeroSection() {
    const { autenticado, ehGestor } = useAuth();

    return (
        <section
            id="inicio"
            className="relative overflow-hidden bg-gradient-to-br from-ufrn-950 via-ufrn-900 to-ufrn-700 text-white border-b border-ufrn-900"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-sky-400/15 blur-3xl"
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-6">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        UFRN • Esporte &amp; Lazer na Areia
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                        Reserve sua Quadra de Areia
                    </h1>

                    <p className="mt-5 text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl">
                        Consulte horários livres em tempo real e agende suas partidas de{' '}
                        <strong className="text-white">Vôlei de Praia</strong>,{' '}
                        <strong className="text-white">Futevôlei</strong> e{' '}
                        <strong className="text-white">Beach Tennis</strong> na estrutura esportiva da UFRN.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                        <a
                            href="#quadras"
                            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-ufrn-950 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ufrn-900"
                        >
                            Ver Quadras
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </a>

                        {autenticado ? (
                            <Link
                                to={ehGestor ? '/admin' : '/minhas-reservas'}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all"
                            >
                                {ehGestor ? (
                                    <>
                                        <ShieldCheck className="w-4 h-4 text-amber-300" />
                                        Abrir Painel Gestor
                                    </>
                                ) : (
                                    <>
                                        <CalendarCheck2 className="w-4 h-4 text-amber-300" />
                                        Minhas Reservas
                                    </>
                                )}
                            </Link>
                        ) : (
                            <a
                                href="#como-funciona"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all"
                            >
                                Como Funciona
                            </a>
                        )}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-200">Funcionamento</p>
                            <p className="text-sm font-bold text-white tabular-nums">08:00 às 22:00 • Blocos de 1h</p>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                            <CalendarCheck2 className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-200">Agenda sem conflitos</p>
                            <p className="text-sm font-bold text-white">Disponibilidade em tempo real</p>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-sky-400/20 text-sky-200 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-200">Acesso seguro</p>
                            <p className="text-sm font-bold text-white">Reagende ou cancele quando precisar</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
