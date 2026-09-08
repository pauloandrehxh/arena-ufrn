export function StepsSection() {
    return (
        <section id="como-funciona" className="bg-white border-t border-b border-slate-200 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Como Funciona?</h2>
                    <p className="text-slate-600 mt-2">Reserve sua quadra em 3 passos simples</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
                            1
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Escolha a Quadra</h3>
                        <p className="text-slate-600 text-sm">Veja a lista de quadras e verifique os status em tempo real.</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
                            2
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Selecione o Horário</h3>
                        <p className="text-slate-600 text-sm">Escolha a data e o horário desejado para a sua partida.</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
                            3
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirme & Jogue</h3>
                        <p className="text-slate-600 text-sm">Finalize o agendamento e divirta-se na estrutura da UFRN.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
