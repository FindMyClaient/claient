'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const industriasList = ['Transporte y Logística','Manufactura','Construcción','Retail y Comercio','Restaurantes y Alimentos','Salud y Farmacia','Educación','Tecnología','Servicios Financieros','Hotelería y Turismo','Automotriz','Agroindustria','Energía','Consultoría','Telecomunicaciones','Bienes Raíces','Seguros']
const tiposList = ['SA de CV','SAPI de CV','SRL de CV','SA','Asociación Civil (AC)','Persona Física con Actividad Empresarial','Organismo Público','ONG / Fundación','Otro']
const empleadosList = ['1 - 10','11 - 50','51 - 200','201 - 500','501 - 1,000','1,001 - 5,000','5,000+']
const estadosList = ['Ciudad de México','Nuevo León','Jalisco','Estado de México','Querétaro','Guanajuato','Puebla','Coahuila','Chihuahua','Sonora','Veracruz','Baja California','Tamaulipas','Sinaloa','Aguascalientes','San Luis Potosí','Yucatán','Hidalgo','Michoacán','Otro']
const deptosList = ['Dirección General','Ventas','Compras y Adquisiciones','Recursos Humanos','Logística','Finanzas','Marketing','Tecnología','Operaciones','Legal','Administración']

type Colaborador = { nombre: string; puesto: string; departamento: string; email: string; telefono: string; linkedin: string }

const emptyColab = (): Colaborador => ({ nombre:'', puesto:'', departamento:'', email:'', telefono:'', linkedin:'' })

export default function RegistroEmpresa() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nombre:'', industria:'', tipo_empresa:'', direccion:'', colonia:'', ciudad:'', estado:'', codigo_postal:'',
    telefono:'', email:'', sitio_web:'', descripcion:'', contacto_nombre:'', contacto_cargo:'',
    num_empleados:'', anio_fundacion:'', linkedin_empresa:'', facebook:'', instagram:'',
    productos_servicios:'', zonas_operacion:[] as string[],
  })
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([emptyColab()])
  const [empresaId, setEmpresaId] = useState('')
  const [codigoSMS, setCodigoSMS] = useState('')
  const [loading, setLoading] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [telefonoVerificado, setTelefonoVerificado] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleZona = (zona: string) => {
    setForm(prev => ({
      ...prev,
      zonas_operacion: prev.zonas_operacion.includes(zona)
        ? prev.zonas_operacion.filter(z => z !== zona)
        : [...prev.zonas_operacion, zona]
    }))
  }

  const handleColab = (i: number, field: keyof Colaborador, value: string) => {
    setColaboradores(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))
  }

  const addColab = () => setColaboradores(prev => [...prev, emptyColab()])
  const removeColab = (i: number) => setColaboradores(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.industria || !form.telefono) {
      setError('Nombre, email, teléfono e industria son requeridos.')
      return
    }
    setLoading(true)
    setError('')
    const payload = {
      ...form,
      zonas_operacion: form.zonas_operacion.join(', '),
      colaboradores: colaboradores.filter(c => c.nombre || c.email),
    }
    const { data, error: err } = await supabase.from('empresas_registro').insert([payload]).select().single()
    if (err) { setError(err.message); setLoading(false); return }
    setEmpresaId(data.id)
    await supabase.auth.signInWithOtp({ email: form.email, options: { emailRedirectTo: window.location.origin + '/registro/confirmar?id=' + data.id } })
    const tel = form.telefono.startsWith('+') ? form.telefono : '+52' + form.telefono.replace(/\D/g,'')
    const smsRes = await fetch('/api/verificar', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ telefono: tel }) })
    if (smsRes.ok) setSmsSent(true)
    setStep(2)
    setLoading(false)
  }

  const handleVerificarSMS = async () => {
    if (!codigoSMS) return
    setLoading(true)
    setError('')
    const tel = form.telefono.startsWith('+') ? form.telefono : '+52' + form.telefono.replace(/\D/g,'')
    const res = await fetch('/api/confirmar', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ telefono: tel, codigo: codigoSMS, empresa_id: empresaId }) })
    const data = await res.json()
    if (data.success) { setTelefonoVerificado(true); setSuccess(true) }
    else setError(data.error || 'Código incorrecto')
    setLoading(false)
  }

  const s = { minHeight:'100vh',background:'#08090a',color:'#e8e8e8',fontFamily:'Inter,sans-serif',padding:'40px 24px' }
  const inp = { width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box' } as React.CSSProperties
  const lbl = { display:'block',fontSize:'11px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase' as const,letterSpacing:'1px' }
  const section = { background:'#0f1011',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'28px',marginBottom:'16px' }
  const sectionTitle = { fontSize:'14px',fontWeight:'600' as const,color:'#fff',marginBottom:'20px',paddingBottom:'12px',borderBottom:'1px solid rgba(255,255,255,0.06)' }

  if (success) return (
    <div style={s}>
      <div style={{maxWidth:'480px',margin:'80px auto',textAlign:'center',...section,border:'1px solid rgba(12,192,223,0.3)'}}>
        <div style={{width:'64px',height:'64px',background:'rgba(12,192,223,0.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px'}}>✅</div>
        <h2 style={{color:'#fff',marginBottom:'8px'}}>Registro completado</h2>
        <p style={{color:'#6b7280',fontSize:'14px'}}>Email y teléfono verificados. Tu empresa aparecerá en nuestra base de datos en 24-48 horas.</p>
        <a href="/" style={{display:'inline-block',marginTop:'24px',background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'14px',padding:'10px 24px',borderRadius:'8px',textDecoration:'none'}}>Volver al inicio</a>
      </div>
    </div>
  )

  if (step === 2) return (
    <div style={s}>
      <div style={{maxWidth:'480px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <img src="/1.svg" alt="CLAIENT" style={{height:'32px',marginBottom:'16px'}} />
          <h2 style={{color:'#fff',fontSize:'22px',marginBottom:'8px'}}>Verifica tu información</h2>
          <p style={{color:'#6b7280',fontSize:'14px'}}>Confirma tu email y teléfono para activar tu empresa.</p>
        </div>
        <div style={section}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
            <div style={{width:'36px',height:'36px',background:'rgba(12,192,223,0.1)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>📧</div>
            <div style={{flex:1}}>
              <div style={{color:'#fff',fontSize:'14px',fontWeight:'500'}}>Verificación de email</div>
              <div style={{color:'#6b7280',fontSize:'12px'}}>Enviamos un enlace a {form.email}</div>
            </div>
          </div>
          <p style={{color:'#6b7280',fontSize:'12px',marginTop:'8px',paddingLeft:'48px'}}>Revisa tu bandeja de entrada y haz click en el enlace de confirmación.</p>
        </div>
        <div style={section}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
            <div style={{width:'36px',height:'36px',background:'rgba(12,192,223,0.1)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>📱</div>
            <div style={{flex:1}}>
              <div style={{color:'#fff',fontSize:'14px',fontWeight:'500'}}>Verificación por SMS</div>
              <div style={{color:'#6b7280',fontSize:'12px'}}>{smsSent ? 'Código enviado a ' + form.telefono : 'Enviando...'}</div>
            </div>
            {telefonoVerificado && <span style={{color:'#0cc0df',fontSize:'12px',fontWeight:'500'}}>✓ Verificado</span>}
          </div>
          {!telefonoVerificado && (
            <div style={{display:'flex',gap:'8px'}}>
              <input value={codigoSMS} onChange={e => setCodigoSMS(e.target.value)} placeholder="Código de 6 dígitos" maxLength={6} style={{...inp,flex:1}} />
              <button onClick={handleVerificarSMS} disabled={loading} style={{background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'14px',padding:'10px 16px',borderRadius:'8px',border:'none',cursor:'pointer',whiteSpace:'nowrap' as const}}>Verificar</button>
            </div>
          )}
        </div>
        {error && <p style={{color:'#f87171',fontSize:'13px',marginTop:'8px'}}>{error}</p>}
      </div>
    </div>
  )

  return (
    <div style={s}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <img src="/1.svg" alt="CLAIENT" style={{height:'32px',marginBottom:'24px'}} />
          <h1 style={{fontSize:'28px',fontWeight:'600',color:'#fff',marginBottom:'8px'}}>Registra tu empresa</h1>
          <p style={{color:'#6b7280',fontSize:'15px'}}>Aparece en las búsquedas de compradores B2B activos en México. Registro gratuito.</p>
        </div>
        <form onSubmit={handleSubmitForm}>

          <div style={section}>
            <div style={sectionTitle}>Información general</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div><label style={lbl}>Nombre de la empresa *</label><input name="nombre" value={form.nombre} onChange={handleChange} required style={inp} /></div>
              <div><label style={lbl}>Giro / Industria *</label><select name="industria" value={form.industria} onChange={handleChange} required style={inp}><option value="">Selecciona...</option>{industriasList.map(i => <option key={i}>{i}</option>)}</select></div>
              <div><label style={lbl}>Tipo de empresa</label><select name="tipo_empresa" value={form.tipo_empresa} onChange={handleChange} style={inp}><option value="">Selecciona...</option>{tiposList.map(t => <option key={t}>{t}</option>)}</select></div>
              <div><label style={lbl}>Número de empleados</label><select name="num_empleados" value={form.num_empleados} onChange={handleChange} style={inp}><option value="">Selecciona...</option>{empleadosList.map(e => <option key={e}>{e}</option>)}</select></div>
              <div><label style={lbl}>Año de fundación</label><input name="anio_fundacion" value={form.anio_fundacion} onChange={handleChange} placeholder="Ej: 2010" style={inp} /></div>
              <div><label style={lbl}>Sitio web</label><input name="sitio_web" value={form.sitio_web} onChange={handleChange} placeholder="https://..." style={inp} /></div>
            </div>
            <div style={{marginTop:'16px'}}><label style={lbl}>Descripción de la empresa</label><textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="¿Qué hace tu empresa? ¿A quién le vende? ¿Qué problema resuelve?" style={{...inp,resize:'vertical' as const}} /></div>
            <div style={{marginTop:'16px'}}><label style={lbl}>Productos o servicios que ofrecen</label><textarea name="productos_servicios" value={form.productos_servicios} onChange={handleChange} rows={2} placeholder="Ej: Distribución de refacciones, consultoría en logística, software ERP..." style={{...inp,resize:'vertical' as const}} /></div>
          </div>

          <div style={section}>
            <div style={sectionTitle}>Dirección</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div style={{gridColumn:'1/-1'}}><label style={lbl}>Calle y número</label><input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ej: Av. Insurgentes Sur 1234" style={inp} /></div>
              <div><label style={lbl}>Colonia</label><input name="colonia" value={form.colonia} onChange={handleChange} style={inp} /></div>
              <div><label style={lbl}>Código postal</label><input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} style={inp} /></div>
              <div><label style={lbl}>Ciudad</label><input name="ciudad" value={form.ciudad} onChange={handleChange} style={inp} /></div>
              <div><label style={lbl}>Estado</label><select name="estado" value={form.estado} onChange={handleChange} style={inp}><option value="">Selecciona...</option>{estadosList.map(e => <option key={e}>{e}</option>)}</select></div>
            </div>
            <div style={{marginTop:'16px'}}>
              <label style={lbl}>Zonas donde operan</label>
              <div style={{display:'flex',flexWrap:'wrap' as const,gap:'8px',marginTop:'8px'}}>
                {estadosList.map(z => (
                  <button key={z} type="button" onClick={() => toggleZona(z)} style={{padding:'4px 12px',borderRadius:'100px',fontSize:'12px',border:'1px solid',borderColor:form.zonas_operacion.includes(z)?'#0cc0df':'rgba(255,255,255,0.1)',background:form.zonas_operacion.includes(z)?'rgba(12,192,223,0.1)':'transparent',color:form.zonas_operacion.includes(z)?'#0cc0df':'#6b7280',cursor:'pointer',transition:'all .15s'}}>{z}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={section}>
            <div style={sectionTitle}>Contacto principal</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div><label style={lbl}>Nombre del contacto</label><input name="contacto_nombre" value={form.contacto_nombre} onChange={handleChange} style={inp} /></div>
              <div><label style={lbl}>Cargo</label><input name="contacto_cargo" value={form.contacto_cargo} onChange={handleChange} style={inp} /></div>
              <div><label style={lbl}>Teléfono *</label><input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="Ej: 8112345678" style={inp} /></div>
              <div><label style={lbl}>Email corporativo *</label><input name="email" type="email" value={form.email} onChange={handleChange} required style={inp} /></div>
            </div>
          </div>

          <div style={section}>
            <div style={sectionTitle}>Redes sociales</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div><label style={lbl}>LinkedIn empresa</label><input name="linkedin_empresa" value={form.linkedin_empresa} onChange={handleChange} placeholder="linkedin.com/company/..." style={inp} /></div>
              <div><label style={lbl}>Facebook</label><input name="facebook" value={form.facebook} onChange={handleChange} placeholder="facebook.com/..." style={inp} /></div>
              <div><label style={lbl}>Instagram</label><input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@usuario" style={inp} /></div>
            </div>
          </div>

          <div style={section}>
            <div style={sectionTitle}>Colaboradores</div>
            <p style={{color:'#6b7280',fontSize:'13px',marginBottom:'20px'}}>Agrega los contactos clave de tu empresa. Aparecerán en las búsquedas de compradores.</p>
            {colaboradores.map((c, i) => (
              <div key={i} style={{background:'#08090a',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'8px',padding:'16px',marginBottom:'12px',position:'relative' as const}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                  <span style={{fontSize:'13px',fontWeight:'500' as const,color:'#fff'}}>Colaborador {i + 1}</span>
                  {i > 0 && <button type="button" onClick={() => removeColab(i)} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:'18px',padding:'0',lineHeight:'1'}}>×</button>}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <div><label style={lbl}>Nombre completo</label><input value={c.nombre} onChange={e => handleColab(i,'nombre',e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Puesto</label><input value={c.puesto} onChange={e => handleColab(i,'puesto',e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Departamento</label><select value={c.departamento} onChange={e => handleColab(i,'departamento',e.target.value)} style={inp}><option value="">Selecciona...</option>{deptosList.map(d => <option key={d}>{d}</option>)}</select></div>
                  <div><label style={lbl}>Email directo</label><input type="email" value={c.email} onChange={e => handleColab(i,'email',e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Teléfono directo</label><input value={c.telefono} onChange={e => handleColab(i,'telefono',e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>LinkedIn personal</label><input value={c.linkedin} onChange={e => handleColab(i,'linkedin',e.target.value)} placeholder="linkedin.com/in/..." style={inp} /></div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addColab} style={{width:'100%',background:'transparent',border:'1px dashed rgba(12,192,223,0.3)',color:'#0cc0df',fontSize:'13px',padding:'10px',borderRadius:'8px',cursor:'pointer',transition:'all .15s'}}>+ Agregar colaborador</button>
          </div>

          {error && <p style={{color:'#f87171',fontSize:'13px',marginBottom:'16px'}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:'100%',background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'15px',padding:'14px',borderRadius:'8px',border:'none',cursor:'pointer',opacity:loading?0.6:1,marginBottom:'8px'}}>{loading ? 'Registrando...' : 'Registrar mi empresa gratis →'}</button>
          <p style={{textAlign:'center',fontSize:'12px',color:'#3d4148'}}>Sin costo · Sin compromisos · Tu información es privada y verificada</p>
        </form>
      </div>
    </div>
  )
}