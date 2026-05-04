import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Locales from './pages/Locales'
import EditarLocal from './pages/EditarLocal'

function App() {
  const token = localStorage.getItem('admin_token')
  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/locales" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/locales" element={token ? <Locales /> : <Navigate to="/login" />} />
      <Route path="/locales/:id" element={token ? <EditarLocal /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App