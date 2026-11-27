import { Link } from 'react-router';
import { ArrowLeft, Compass } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full bg-white rounded-3xl border border-sand-200 p-8 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-ufrn-50 text-ufrn-700 flex items-center justify-center mx-auto mb-5">
                        <Compass className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ufrn-700 mb-2">
                        Página não encontrada • 404
                    </p>
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                        Fora de quadra!
                    </h1>
                    <p className="text-sm text-slate-600 mb-6">
                        O endereço que você procurou não existe ou foi movido.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-ufrn-800 hover:bg-ufrn-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para a página inicial
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
