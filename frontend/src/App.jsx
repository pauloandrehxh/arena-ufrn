import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import QuadraReservaPage from './pages/QuadraReservaPage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import MinhasReservasPage from './pages/MinhasReservasPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quadras/:id" element={<QuadraReservaPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route
                path="/minhas-reservas"
                element={
                    <ProtectedRoute>
                        <MinhasReservasPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['GESTOR']}>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
