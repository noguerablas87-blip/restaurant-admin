import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://restaurant-backend-production-1271.up.railway.app'

export default function Locales() {
  const navigate = useNavigate()
  const [locales, setLocales] = useState([])
  const [nuevo, setNuevo] = useState({ slug: '', nombre: '', descripcion: '', color_primario: '#1D9E75', tiempo_prep_min: 15, password: '' })
  const [mostrarForm, setMostrarForm] = useState(false)

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/locales/admin/todos`)
      setLocales(res.data)
    } catch (e) { }
  }

  useEffect(() => { cargar() }, [])

  const crearLocal = async () => {
    try {
      await axios.post(`${API}/locales/`, nuevo)
      setNuevo({ slug: '', nombre: '', descripcion: '', color_primario: '#1D9E75', tiempo_prep_min: 15, password: '' })
      setMostrarForm(false)
      cargar()
    } catch (e) {
      alert('Error al crear el local — el slug puede estar en uso')
    }
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 700 }}>⚙️ Panel Admin</h1>
          <p style={{ color: '#888', margin: 0, fontSize: 12 }}>Gestión de locales</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setMostrarForm(!mostrarForm)} style={{
            background: '#1D9E75', color: 'white', border: 'none',
            borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 700
          }}>+ Nuevo local</button>
          <button onClick={logout} style={{
            background: '#333', color: 'white', border: 'none',
            borderRadius: 10, padding: '8px 16px', cursor: 'pointer'
          }}>Salir</button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {mostrarForm && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>Nuevo local</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="Slug (ej: don-carlos)" value={nuevo.slug}
                onChange={e => setNuevo({ ...nuevo, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
              <input placeholder="Nombre del local" value={nuevo.nombre}
                onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
                style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
              <input placeholder="Descripción" value={nuevo.descripcion}
                onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}
                style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none', gridColumn: '1/-1' }} />
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Color principal</label>
                <input type="color" value={nuevo.color_primario}
                  onChange={e => setNuevo({ ...nuevo, color_primario: e.target.value })}
                  style={{ width: '100%', height: 44, border: '2px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }} />
              </div>
              <input placeholder="Tiempo prep (minutos)" type="number" value={nuevo.tiempo_prep_min}
                onChange={e => setNuevo({ ...nuevo, tiempo_prep_min: parseInt(e.target.value) })}
                style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
              <input placeholder="Contraseña para el dueño" value={nuevo.password}
                onChange={e => setNuevo({ ...nuevo, password: e.target.value })}
                style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none', gridColumn: '1/-1' }} />
              <button onClick={crearLocal} style={{
                gridColumn: '1/-1', background: '#1D9E75', color: 'white',
                border: 'none', borderRadius: 10, padding: '12px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer'
              }}>Crear local</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {locales.map(local => (
            <div key={local.id} onClick={() => navigate(`/locales/${local.id}`)} style={{
              background: 'white', borderRadius: 16, padding: 20, cursor: 'pointer',
              borderLeft: `6px solid ${local.color_primario || '#1D9E75'}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}>
              {local.logo_url && <img src={local.logo_url} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />}
              <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>{local.nombre}</h3>
              <p style={{ margin: '0 0 8px', color: '#888', fontSize: 13 }}>{local.descripcion}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: '#f0f0f0', borderRadius: 20, padding: '4px 10px', fontSize: 12 }}>/{local.slug}</span>
                <span style={{ background: local.color_primario + '22', color: local.color_primario, borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                  {local.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}