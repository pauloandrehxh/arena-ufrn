import { CalendarClock, CheckCircle2, MapPinned, Info } from 'lucide-react';

export function StepsSection() {
    const etapas = [
        {
            numero: '01',
            titulo: 'Escolha a Quadra',
            descricao: 'Veja a lista de quadras de areia, modalidades suportadas e status de manutenção em tempo real.',
            icone: MapPinned,
        },
        {
            numero: '02',
            titulo: 'Selecione o Horário',
            descricao: 'Escolha a data desejada e visualize imediatamente os blocos livres das 08:00 às 22:00.',
            icone: CalendarClock,
        },
        {
            numero: '03',
            titulo: 'Confirme & Jogue',
            descricao: 'Entre com sua conta de aluno, finalize a reserva e gerencie reagendamentos ou cancelamentos.',
            icone: CheckCircle2,
        },
    ];

    return (
        <section id="como-funciona" className="bg-white border-t border-b border-sand-200 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Como Funciona?
                    </h2>
                    <p className="text-slate-600 mt-2">
                        Reserve sua quadra em 3 passos simples, sem filas e sem conflitos de horário.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {etapas.map((etapa) => {
                        const Icone = etapa.icone;
                        return (
                            <div
                                key={etapa.numero}
                                className="rounded-2xl bg-sand-50/70 border border-sand-200 p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="w-11 h-11 rounded-xl bg-ufrn-800 text-amber-300 flex items-center justify-center shadow-xs">
                                            <Icone className="w-5 h-5" aria-hidden="true" />
                                        </div>
                                        <span className="text-xs font-extrabold tracking-widest text-slate-400">
                                            PASSO {etapa.numero}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {etapa.titulo}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {etapa.descricao}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-2xl bg-ufrn-50 border border-ufrn-600/15 p-5 flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-ufrn-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-sm text-slate-700 leading-relaxed">
                        <strong className="text-ufrn-900">Boas práticas de agendamento:</strong> os horários seguem o fuso oficial de Natal/Fortaleza (<code className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">America/Fortaleza</code>). Caso não possa comparecer, cancele antes do horário de início para liberar a quadra automaticamente para outros alunos.
                    </div>
                </div>
            </div>
        </section>
    );
}
