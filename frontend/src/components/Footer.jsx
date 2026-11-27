import { Link } from 'react-router';
import { Sun } from 'lucide-react';

export function Footer() {
    return (
        <footer className="mt-auto bg-ufrn-950 text-slate-300 border-t border-ufrn-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center">
                            <Sun className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white">Arena UFRN</p>
                            <p className="text-xs text-slate-400">
                                Gestão e Reserva de Quadras de Areia • Campus Central
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-sm">
                        <Link to="/" className="hover:text-white transition-colors">
                            Início
                        </Link>
                        <Link to="/minhas-reservas" className="hover:text-white transition-colors">
                            Minhas Reservas
                        </Link>
                        <Link to="/admin" className="hover:text-white transition-colors">
                            Área do Gestor
                        </Link>
                        <Link to="/login" className="hover:text-white transition-colors">
                            Entrar
                        </Link>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} Arena UFRN — Universidade Federal do Rio Grande do Norte</p>
                    <p>Funcionamento diário das 08:00 às 22:00 (Horário de Fortaleza)</p>
                </div>
            </div>
        </footer>
    );
}
