export function HeroSection() {
    return (
        <section id="inicio" className="bg-gradient-to-b from-blue-50/60 to-transparent py-16 px-4 text-center border-b border-slate-200">
            <div className="max-w-3xl mx-auto space-y-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    UFRN • Esporte & Lazer
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Reserve sua Quadra de Areia
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Plataforma simples para agendamento de quadras de Vôlei de Praia, Futevôlei e Beach Tennis na UFRN.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                    <a
                        href="#quadras"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-all"
                    >
                        Ver Quadras
                    </a>
                    <a
                        href="#como-funciona"
                        className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-300 transition-all"
                    >
                        Como Funciona
                    </a>
                </div>
            </div>
        </section>
    );
}
