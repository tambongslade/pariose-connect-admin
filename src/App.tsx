import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { RolesManagement } from './pages/RolesManagement';
import { UsersManagement } from './pages/UsersManagement';
import { EcclesiasticalUnitsManagement } from './pages/EcclesiasticalUnitsManagement';
import { CelebrationsManagement } from './pages/CelebrationsManagement';
import { ActivitiesManagement } from './pages/ActivitiesManagement';
import { AnnouncementsManagement } from './pages/AnnouncementsManagement';
import { ConfessionsManagement } from './pages/ConfessionsManagement';
import { HolyPlacesManagement } from './pages/HolyPlacesManagement';
import { SacredObjectsManagement } from './pages/SacredObjectsManagement';
import { LanguagesManagement } from './pages/LanguagesManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthChecker } from './components/AuthChecker';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthChecker />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsersManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RolesManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ecclesiastical-units"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EcclesiasticalUnitsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/celebrations"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CelebrationsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ActivitiesManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AnnouncementsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/confessions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ConfessionsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/holy-places"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HolyPlacesManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sacred-objects"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SacredObjectsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/languages"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LanguagesManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-2xl font-bold">Page Événements (Bientôt disponible)</div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/masses"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-2xl font-bold">Page Messes (Bientôt disponible)</div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-2xl font-bold">Page Annonces (Bientôt disponible)</div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ministries"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-2xl font-bold">Page Ministères (Bientôt disponible)</div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donations"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-2xl font-bold">Page Dons (Bientôt disponible)</div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-2xl font-bold">Page Paramètres (Bientôt disponible)</div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          {/* Catch all route - redirect to dashboard or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
