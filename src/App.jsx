import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import PecasPage from './pages/Pecas/PecasPage'
import PecaFormPage from './pages/Pecas/PecaFormPage'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout/Layout'

function ProtectedLayout() {
  return (
    <PrivateRoute>
      <Layout />
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pecas" element={<PecasPage />} />
          <Route path="/pecas/nova" element={<PecaFormPage />} />
          <Route path="/pecas/:id/editar" element={<PecaFormPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
