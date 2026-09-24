import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/therapist/Dashboard';
import Schedule from './pages/therapist/Schedule';
import PublicProfile from './pages/public/PublicProfile';
import Booking from './pages/public/Booking';
import { ScheduleProvider } from './context/ScheduleContext';
import ClientsList from './pages/therapist/crm/ClientsList';
import ClientProfile from './pages/therapist/crm/ClientProfile';
import Payments from './pages/therapist/finance/Payments';
import Notes from './pages/therapist/clinical/Notes';
import Chat from './pages/therapist/chat/Chat';
import Analytics from './pages/therapist/analytics/Analytics';
import AppLayout from './layouts/AppLayout';
import ClientLogin from './pages/client/ClientLogin';
import ClientPortal from './pages/client/ClientPortal';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScheduleProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/client/login" element={<ClientLogin />} />

            {/* Protected Therapist Routes */}
            <Route element={<ProtectedRoute allowedRole="therapist" />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/clients/:clientId" element={<ClientProfile />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Route>

            {/* Protected Client Routes */}
            <Route element={<ProtectedRoute allowedRole="client" />}>
              <Route path="/portal" element={<ClientPortal />} />
            </Route>

            {/* Public Therapist Routes */}
            <Route path="/book/:slug" element={<Booking />} />
            <Route path="/:slug" element={<PublicProfile />} />

            {/* Default / Fallback Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ScheduleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
