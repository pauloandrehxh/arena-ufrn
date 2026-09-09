export function Navbar() {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🏖️</span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Arena UFRN</span>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#inicio" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Início
                    </a>
                    <a href="#quadras" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Quadras
                    </a>
                    <a href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Como Funciona
                    </a>
                </nav>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
                    Entrar
                </button>
            </div>
        </header>
    );
}
