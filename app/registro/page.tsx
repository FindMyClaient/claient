'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const industriasList = [
  'Transporte y Logística','Manufactura','Construcción','Retail y Comercio',
  'Restaurantes y Alimentos','Salud y Farmacia','Educación','Tecnología',
  'Servicios Financieros','Hotelería y Turismo','Automotriz','Agroindustria',
  'Energía','Consultoría','Telecomunicaciones','Bienes Raíces','Seguros',
]
const estadosList = [
  'Ciudad de México','Nuevo León','Jalisco','Estado de México','Querétaro',
  'Guanajuato','Puebla','Coahuila','Chihuahua','Sonora','Veracruz',
  'Baja California','Tamaulipas','Sinaloa','Aguascalientes','San Luis Potosí',
  'Yucatán','Hidalgo','Michoacán','Otro',
]

export default function RegistroEmpresa() {
  const [form, setForm] = useState({
    nombre: '', industria: '', ciudad: '', estado: '', telefono: '',
    email: '', sitio_web: '', descripcion: '', contacto_nombre: '', contacto_cargo: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.industria) {
      setError('Nombre, email e industria son requeridos.')
      return
    }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('empresas_registro').insert([form])
    if (err) setError(err.message)
    else setSuccess(true)
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#08090a',color:'#e8e8e8',fontFamily:'Inter,sans-serif',padding:'40px 24px'}}>
      <div style={{maxWidth:'640px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <img src="/1.svg" alt="CLAIENT" style={{height:'32px',marginBottom:'24px'}} />
          <h1 style={{fontSize:'28px',fontWeight:'600',color:'#fff',marginBottom:'8px'}}>Registra tu empresa</h1>
          <p style={{color:'#6b7280',fontSize:'15px'}}>Aparece en las búsquedas de compradores B2B activos en México. Registro gratuito.</p>
        </div>
        {success ? (
          <div style={{background:'#0f1011',border:'1px solid rgba(12,192,223,0.3)',borderRadius:'12px',padding:'40px',textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>✅</div>
            <h2 style={{color:'#fff',marginBottom:'8px'}}>Registro exitoso</h2>
            <p style={{color:'#6b7280'}}>Tu empresa fue enviada para revisión. Te notificaremos cuando esté activa.</p>
            <a href="/" style={{display:'inline-block',marginTop:'24px',color:'#0cc0df',textDecoration:'none'}}>Volver al inicio</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{background:'#0f1011',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'32px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Nombre *</label><input name="nombre" value={form.nombre} onChange={handleChange} required style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Industria *</label><select name="industria" value={form.industria} onChange={handleChange} required style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}}><option value="">Selecciona...</option>{industriasList.map(i => <option key={i}>{i}</option>)}</select></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Ciudad</label><input name="ciudad" value={form.ciudad} onChange={handleChange} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Estado</label><select name="estado" value={form.estado} onChange={handleChange} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}}><option value="">Selecciona...</option>{estadosList.map(e => <option key={e}>{e}</option>)}</select></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Teléfono</label><input name="telefono" value={form.telefono} onChange={handleChange} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Sitio web</label><input name="sitio_web" value={form.sitio_web} onChange={handleChange} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
              <div><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Contacto</label><input name="contacto_nombre" value={form.contacto_nombre} onChange={handleChange} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
            </div>
            <div style={{marginBottom:'16px'}}><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Cargo</label><input name="contacto_cargo" value={form.contacto_cargo} onChange={handleChange} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
            <div style={{marginBottom:'24px'}}><label style={{display:'block',fontSize:'12px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>Descripción</label><textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none',resize:'vertical'}} /></div>
            {error && <p style={{color:'#f87171',fontSize:'13px',marginBottom:'16px'}}>{error}</p>}
            <button type="submit" disabled={loading} style={{width:'100%',background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'14px',padding:'12px',borderRadius:'8px',border:'none',cursor:'pointer',opacity:loading?0.6:1}}>{loading ? 'Registrando...' : 'Registrar mi empresa gratis →'}</button>
          </form>
        )}
      </div>
    </div>
  )
}