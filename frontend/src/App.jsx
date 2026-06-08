import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import OnboardPage from './pages/OnboardPage';
import DashboardPage from './pages/DashboardPage';
import TelemetryPage from './pages/TelemetryPage';
import OptimizationPage from './pages/OptimizationPage';
import CompliancePage from './pages/CompliancePage';
import ForecastingPage from './pages/ForecastingPage';
import PredictionPage from './pages/PredictionPage';

// Route Guard Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Dashboard/App Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/onboard" element={<ProtectedRoute><OnboardPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/telemetry" element={<ProtectedRoute><TelemetryPage /></ProtectedRoute>} />
            <Route path="/optimization" element={<ProtectedRoute><OptimizationPage /></ProtectedRoute>} />
            <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
            <Route path="/forecasting" element={<ProtectedRoute><ForecastingPage /></ProtectedRoute>} />
            <Route path="/predict" element={<ProtectedRoute><PredictionPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
