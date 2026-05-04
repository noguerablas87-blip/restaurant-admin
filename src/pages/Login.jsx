import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = 'blas2024admin'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_token', 'blas-admin-logueado')
      window.location.href = window.location.origin + '/locales'
    } else {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 40,
        width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚙️</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Panel Admin</h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>Solo para administradores</p>
        </div>
        <input
          type="password"
          placeholder="Contraseña de admin"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{
            width: '100%', border: '2px solid #e0e0e0', borderRadius: 12,
            padding: '12px 14px', fontSize: 15, boxSizing: 'border-box',
            outline: 'none', marginBottom: 16
          }}
        />
        {error && <p style={{ color: 'red', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
        <button onClick={login} style={{
          width: '100%', background: '#1D9E75', color: 'white',
          border: 'none', borderRadius: 12, padding: '14px',
          fontSize: 16, fontWeight: 700, cursor: 'pointer'
        }}>
          Entrar
        </button>
      </div>
    </div>
  )
}