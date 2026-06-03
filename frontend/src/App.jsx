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

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboard" element={<OnboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/optimization" element={<OptimizationPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/forecasting" element={<ForecastingPage />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
