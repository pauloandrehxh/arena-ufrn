import { useState, useEffect } from 'react';

export function QuadrasSection() {
    const [quadras, setQuadras] = useState([
        {
            id: 1,
            name: 'Quadra de Areia 1',
            description: 'Quadra principal para jogos de Vôlei de Praia e Futevôlei.',
            status: 'Disponível',
        },
        {
            id: 2,
            name: 'Quadra de Areia 2',
            description: 'Quadra secundária ideal para treinos e Beach Tennis.',
            status: 'Em Manutenção',
        },
    ]);
    const [loading, setLoading] = useState(true);

    // Busca as quadras no backend ou usa os dados iniciais
    useEffect(() => {
        fetch('http://localhost:3000/api/quadras')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const updated = data.map((q) => ({
                        ...q,
                        status: q.description?.includes('construção') ? 'Em Manutenção' : 'Disponível',
                    }));
                    setQuadras(updated);
                }
            })
            .catch((err) => {
                console.log('Usando dados locais de exemplo:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section id="quadras" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Quadras Disponíveis</h2>
                <p className="text-slate-600 mt-2">Escolha uma quadra para verificar os horários e agendar.</p>
            </div>

            {loading ? (
                <p className="text-center text-slate-500 py-8">Carregando quadras...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quadras.map((quadra) => (
                        <div
                            key={quadra.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">{quadra.name}</h3>
                                    <span
                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${quadra.status === 'Disponível'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-rose-100 text-rose-800'
                                            }`}
                                    >
                                        {quadra.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{quadra.description}</p>
                            </div>

                            <button
                                disabled={quadra.status !== 'Disponível'}
                                onClick={() => alert(`Reserva para ${quadra.name} em breve!`)}
                                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${quadra.status === 'Disponível'
                                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {quadra.status === 'Disponível' ? 'Ver Horários' : 'Indisponível'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
