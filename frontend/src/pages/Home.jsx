import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { QuadrasSection } from '../components/QuadrasSection';
import { StepsSection } from '../components/StepsSection';
import { Footer } from '../components/Footer';

function Home() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            <Navbar />
            <HeroSection />
            <QuadrasSection />
            <StepsSection />
            <Footer />
        </div>
    );
}

export default Home;