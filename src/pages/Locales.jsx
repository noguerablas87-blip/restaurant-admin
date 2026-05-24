import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://restaurant-backend-production-1271.up.railway.app'

function diasRestantes(fechaVencimiento) {
  if (!fechaVencimiento) return null
  const hoy = new Date()
  const vence = new Date(fechaVencimiento)
  const diff = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24))
  return diff
}

function estadoLocal(local) {
  if (!local.activo) return { label: 'Inactivo', color: '#ef4444', bg: '#1a0000' }
  if (local.en_trial) {
    const dias = diasRestantes(local.fecha_vencimiento)
    if (dias === null) return { label: 'Trial', color: '#f59e0b', bg: '#1a1000' }
    if (dias <= 0) return { label: 'Trial vencido', color: '#ef4444', bg: '#1a0000' }
    if (dias <= 5) return { label: `Trial — ${dias} días`, color: '#f59e0b', bg: '#1a1000' }
    return { label: `Trial — ${dias} días`, color: '#3b82f6', bg: '#001a3a' }
  }
  const dias = diasRestantes(local.fecha_vencimiento)
  if (dias === null) return { label: 'Activo', color: '#22c55e', bg: '#001a0a' }
  if (dias <= 0) return { label: 'Vencido', color: '#ef4444', bg: '#1a0000' }
  if (dias <= 5) return { label: `Vence en ${dias} días`, color: '#f59e0b', bg: '#1a1000' }
  return { label: `Activo — ${dias} días`, color: '#22c55e', bg: '#001a0a' }
}

export default function Locales() {
  const navigate = useNavigate()
  const [locales, setLocales] = useState([])
  const [nuevo, setNuevo] = useState({ slug: '', nombre: '', descripcion: '', color_primario: '#1D9E75', tiempo_prep_min: 15, password: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [localCreado, setLocalCreado] = useState(null)

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/locales/admin/todos`)
      setLocales(res.data)
    } catch (e) { }
  }

  useEffect(() => { cargar() }, [])

  const crearLocal = async () => {
    if (!nuevo.slug || !nuevo.nombre || !nuevo.password) {
      alert('Slug, nombre y contraseña son obligatorios')
      return
    }
    try {
      await axios.post(`${API}/locales/`, nuevo)
      setLocalCreado({ slug: nuevo.slug, password: nuevo.password, nombre: nuevo.nombre })
      setNuevo({ slug: '', nombre: '', descripcion: '', color_primario: '#1D9E75', tiempo_prep_min: 15, password: '' })
      setMostrarForm(false)
      cargar()
    } catch (e) {
      alert('Error al crear el local — el slug puede estar en uso')
    }
  }

  const activar = async (id, e) => {
    e.stopPropagation()
    try {
      await axios.patch(`${API}/locales/admin/${id}/activar`)
      cargar()
    } catch (e) { alert('Error al activar') }
  }

  const desactivar = async (id, e) => {
    e.stopPropagation()
    if (!confirm('¿Desactivar este local?')) return
    try {
      await axios.patch(`${API}/locales/admin/${id}/desactivar`)
      cargar()
    } catch (e) { alert('Error al desactivar') }
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  // Stats generales
  const totalActivos = locales.filter(l => l.activo).length
  const totalTrial = locales.filter(l => l.en_trial && l.activo).length
  const porVencer = locales.filter(l => {
    const dias = diasRestantes(l.fecha_vencimiento)
    return dias !== null && dias <= 5 && dias > 0 && l.activo
  }).length

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'system-ui, sans-serif' }}>

      {/* Modal credenciales */}
      {localCreado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h2 style={{ margin: '0 0 8px', color: '#111' }}>Local creado exitosamente</h2>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px' }}>Guardá estas credenciales para entregárselas al dueño</p>
            <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'left' }}>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#555' }}><strong>Local:</strong> {localCreado.nombre}</p>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#555' }}><strong>URL tablet:</strong> restaurant-tablet.vercel.app/login</p>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#555' }}><strong>Slug:</strong> {localCreado.slug}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#555' }}><strong>Contraseña:</strong> {localCreado.password}</p>
            </div>
            <button onClick={() => setLocalCreado(null)} style={{ width: '100%', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 700 }}>⚙️ Panel Admin — Valmai</h1>
          <p style={{ color: '#888', margin: 0, fontSize: 12 }}>Gestión de locales</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: '#1D9E75', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}>+ Nuevo local</button>
          <button onClick={logout} style={{ background: '#333', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer' }}>Salir</button>
        </div>
      </div>

      <div style={{ padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total locales', value: locales.length, color: '#3b82f6', icon: '🏪' },
            { label: 'Activos', value: totalActivos, color: '#22c55e', icon: '✅' },
            { label: 'En trial', value: totalTrial, color: '#f59e0b', icon: '⏳' },
            { label: 'Por vencer', value: porVencer, color: '#ef4444', icon: '⚠️' },
          ].map(s => (
            <div key={s.label} style={{ background: '#1a1a2e', borderRadius: 14, padding: '16px 20px', border: '1px solid #2a2a3e' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 28, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Formulario nuevo local */}
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
              <button onClick={crearLocal} style={{ gridColumn: '1/-1', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Crear local
              </button>
            </div>
          </div>
        )}

        {/* Lista de locales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {locales.map(local => {
            const estado = estadoLocal(local)
            const dias = diasRestantes(local.fecha_vencimiento)
            return (
              <div key={local.id} style={{
                background: '#1a1a2e', borderRadius: 16, padding: 20, cursor: 'pointer',
                borderLeft: `6px solid ${local.color_primario || '#1D9E75'}`,
                border: `1px solid #2a2a3e`,
                borderLeftWidth: 6,
                borderLeftColor: local.color_primario || '#1D9E75',
              }} onClick={() => navigate(`/locales/${local.id}`)}>

                {/* Cabecera */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {local.logo_url && <img src={local.logo_url} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, color: 'white' }}>{local.nombre}</h3>
                      <p style={{ margin: 0, fontSize: 12, color: '#555' }}>/{local.slug}</p>
                    </div>
                  </div>
                  <span style={{ background: estado.bg, color: estado.color, borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                    {estado.label}
                  </span>
                </div>

                {/* Fecha vencimiento */}
                {local.fecha_vencimiento && (
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: '#555' }}>
                    🗓 Vence: {new Date(local.fecha_vencimiento).toLocaleDateString('es-PY')}
                    {dias !== null && dias <= 5 && dias > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}> ⚠️ {dias} días</span>}
                  </p>
                )}

                {/* Fecha registro */}
                {local.fecha_registro && (
                  <p style={{ margin: '0 0 12px', fontSize: 12, color: '#444' }}>
                    📅 Registrado: {new Date(local.fecha_registro).toLocaleDateString('es-PY')}
                  </p>
                )}

                {/* Botones */}
                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                  {!local.activo || local.en_trial ? (
                    <button onClick={e => activar(local.id, e)} style={{ flex: 1, background: '#15803d', color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      ✓ Activar (30 días)
                    </button>
                  ) : (
                    <button onClick={e => activar(local.id, e)} style={{ flex: 1, background: '#1e3a5f', color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      🔄 Renovar (30 días)
                    </button>
                  )}
                  {local.activo && (
                    <button onClick={e => desactivar(local.id, e)} style={{ flex: 1, background: '#7f1d1d', color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      ✗ Desactivar
                    </button>
                  )}
                  <button onClick={e => { e.stopPropagation(); navigate(`/locales/${local.id}`) }} style={{ background: '#2a2a3e', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>
                    ✏️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
