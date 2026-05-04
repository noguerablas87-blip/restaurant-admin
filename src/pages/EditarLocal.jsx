import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = 'https://restaurant-backend-production-1271.up.railway.app'
const CLOUDINARY_CLOUD = 'dmunelwl2'
const CLOUDINARY_PRESET = 'restaurante_menu'

export default function EditarLocal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [local, setLocal] = useState(null)
  const [subiendo, setSubiendo] = useState({ logo: false, banner: false })
  const [guardando, setGuardando] = useState(false)
  const [token, setToken] = useState(null)

  const getToken = async () => {
    try {
      const res = await axios.get(`${API}/locales/admin/${id}`)
      setLocal(res.data)
    } catch (e) { }
  }

  useEffect(() => { getToken() }, [id])

  const subirImagen = async (archivo, tipo) => {
    setSubiendo(prev => ({ ...prev, [tipo]: true }))
    try {
      const formData = new FormData()
      formData.append('file', archivo)
      formData.append('upload_preset', CLOUDINARY_PRESET)
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        formData
      )
      setLocal(prev => ({ ...prev, [`${tipo}_url`]: res.data.secure_url }))
    } catch (e) {
      alert('Error al subir imagen')
    } finally {
      setSubiendo(prev => ({ ...prev, [tipo]: false }))
    }
  }

  const guardar = async () => {
    setGuardando(true)
    try {
      await axios.patch(`${API}/locales/admin/${id}`, {
        nombre: local.nombre,
        descripcion: local.descripcion,
        color_primario: local.color_primario,
        color_secundario: local.color_secundario,
        tiempo_prep_min: local.tiempo_prep_min,
        logo_url: local.logo_url,
        banner_url: local.banner_url,
      })
      alert('¡Guardado correctamente!')
    } catch (e) {
      alert('Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  if (!local) return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white' }}>Cargando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/locales')} style={{ background: '#333', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer' }}>← Volver</button>
        <h1 style={{ color: 'white', margin: 0, fontSize: 18 }}>Editar — {local.nombre}</h1>
      </div>

      <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>

        {/* Preview */}
        <div style={{
          borderRadius: 20, overflow: 'hidden', marginBottom: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            background: local.banner_url ? `url(${local.banner_url}) center/cover` : local.color_primario,
            height: 140, display: 'flex', alignItems: 'flex-end', padding: '16px'
          }}>
            {local.logo_url && (
              <img src={local.logo_url} style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid white', objectFit: 'cover' }} />
            )}
          </div>
          <div style={{ background: 'white', padding: '16px 20px' }}>
            <h2 style={{ margin: 0, color: local.color_primario }}>{local.nombre}</h2>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: 14 }}>{local.descripcion}</p>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 16px' }}>Información básica</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input value={local.nombre || ''} onChange={e => setLocal({ ...local, nombre: e.target.value })}
              placeholder="Nombre"
              style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
            <input type="number" value={local.tiempo_prep_min || 15} onChange={e => setLocal({ ...local, tiempo_prep_min: parseInt(e.target.value) })}
              placeholder="Tiempo prep (min)"
              style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none' }} />
            <input value={local.descripcion || ''} onChange={e => setLocal({ ...local, descripcion: e.target.value })}
              placeholder="Descripción"
              style={{ border: '2px solid #e0e0e0', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none', gridColumn: '1/-1' }} />
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Color principal</label>
              <input type="color" value={local.color_primario || '#1D9E75'}
                onChange={e => setLocal({ ...local, color_primario: e.target.value })}
                style={{ width: '100%', height: 44, border: '2px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Color secundario</label>
              <input type="color" value={local.color_secundario || '#085041'}
                onChange={e => setLocal({ ...local, color_secundario: e.target.value })}
                style={{ width: '100%', height: 44, border: '2px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 16px' }}>Imágenes del local</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Logo */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Logo</label>
              {local.logo_url && <img src={local.logo_url} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, display: 'block' }} />}
              <label style={{
                background: '#f0f0f0', border: '2px dashed #ccc', borderRadius: 12,
                padding: '12px 16px', cursor: 'pointer', fontSize: 14, color: '#555',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                🖼 {subiendo.logo ? 'Subiendo...' : 'Subir logo'}
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && subirImagen(e.target.files[0], 'logo')} />
              </label>
            </div>

            {/* Banner */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Banner / portada</label>
              {local.banner_url && <img src={local.banner_url} style={{ width: '100%', height: 80, borderRadius: 10, objectFit: 'cover', marginBottom: 8, display: 'block' }} />}
              <label style={{
                background: '#f0f0f0', border: '2px dashed #ccc', borderRadius: 12,
                padding: '12px 16px', cursor: 'pointer', fontSize: 14, color: '#555',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                🖼 {subiendo.banner ? 'Subiendo...' : 'Subir banner'}
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && subirImagen(e.target.files[0], 'banner')} />
              </label>
            </div>
          </div>
        </div>

        <button onClick={guardar} disabled={guardando} style={{
          width: '100%', background: guardando ? '#ccc' : '#1D9E75',
          color: 'white', border: 'none', borderRadius: 12,
          padding: '16px', fontSize: 16, fontWeight: 700, cursor: 'pointer'
        }}>
          {guardando ? 'Guardando...' : '💾 Guardar cambios'}
        </button>
      </div>
    </div>
  )
}