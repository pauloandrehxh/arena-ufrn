import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { QuadrasSection } from '../components/QuadrasSection';
import { StepsSection } from '../components/StepsSection';
import { Footer } from '../components/Footer';

function Home() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const alvo = document.querySelector(hash);
        if (alvo) {
            alvo.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);

    return (
        <div className="min-h-screen bg-sand-50 text-slate-800 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <QuadrasSection />
                <StepsSection />
            </main>
            <Footer />
        </div>
    );
}

export default Home;
