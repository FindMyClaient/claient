'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PanelPro() {
  const [user, setUser] = useState<any>(null)
  const [suscripcion, setSuscripcion] = useState<any>(null)
  const [historial, setHistorial] = useState<any[]>([])
  const [revelados, setRevelados] = useState<any[]>([])
  const [equipo, setEquipo] = useState<any[]>([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [newCreditos, setNewCreditos] = useState(100)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: sus } = await supabase.from('suscripciones').select('*').eq('user_id', user.id).single()
      setSuscripcion(sus)
      const { data: hist } = await supabase.from('historial_busquedas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
      setHistorial(hist || [])
      const { data: rev } = await supabase.from('prospectos_revelados').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      setRevelados(rev || [])
      const { data: eq } = await supabase.from('equipo_usuarios').select('*').eq('admin_user_id', user.id)
      setEquipo(eq || [])
      setLoading(false)
    }
    load()
  }, [])

  const agregarUsuario = async () => {
    if (!newEmail) return
    await supabase.from('equipo_usuarios').insert([{ admin_user_id: user.id, user_email: newEmail, creditos_asignados: newCreditos }])
    const { data } = await supabase.from('equipo_usuarios').select('*').eq('admin_user_id', user.id)
    setEquipo(data || [])
    setNewEmail('')
  }

  const diasRestantes = suscripcion?.fecha_vencimiento
    ? Math.ceil((new Date(suscripcion.fecha_vencimiento).getTime() - Date.now()) / 86400000)
    : null

  const s = { minHeight:'100vh',background:'#08090a',color:'#e8e8e8',fontFamily:'Inter,sans-serif' }
  const card = { background:'#0f1011',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',padding:'24px' }
  const tabBtn = (t: string) => ({ padding:'8px 16px',borderRadius:'8px',fontSize:'13px',border:'none',cursor:'pointer' as const,background:tab===t?'rgba(12,192,223,0.1)':'transparent',color:tab===t?'#0cc0df':'#6b7280',transition:'all .15s' })

  if (loading) return <div style={{...s,display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'#6b7280'}}>Cargando panel...</p></div>

  return (
    <div style={s}>
      <div style={{borderBottom:'1px solid rgba(255,255,255,0.06)',background:'#0d0d0d',padding:'0 32px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:'56px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <img src="/1.svg" alt="CLAIENT" style={{height:'22px'}} />
            <span style={{fontSize:'12px',color:'#6b7280',borderLeft:'1px solid rgba(255,255,255,0.1)',paddingLeft:'12px'}}>Panel {suscripcion?.plan?.toUpperCase() || 'PRO'}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            {diasRestantes !== null && diasRestantes <= 5 && (
              <div style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.3)',borderRadius:'8px',padding:'6px 12px',fontSize:'12px',color:'#fb923c'}}>
                ⚠️ Plan vence en {diasRestantes} días
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'12px',color:'#6b7280'}}>Créditos:</span>
              <span style={{fontSize:'16px',fontWeight:'600',color:'#0cc0df'}}>{suscripcion?.creditos?.toLocaleString() || '0'}</span>
            </div>
            <button onClick={() => router.push('/buscar')} style={{background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'13px',padding:'6px 14px',borderRadius:'8px',border:'none',cursor:'pointer'}}>Ir al buscador</button>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} style={{background:'transparent',color:'#6b7280',fontSize:'13px',padding:'6px 14px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer'}}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'32px'}}>
        <div style={{marginBottom:'24px'}}>
          <h1 style={{fontSize:'22px',fontWeight:'600',color:'#fff',marginBottom:'4px'}}>Bienvenido, {user?.email}</h1>
          <p style={{color:'#6b7280',fontSize:'14px'}}>Plan {suscripcion?.plan || 'Free'} · {suscripcion?.status === 'active' ? 'Activo' : 'Sin plan activo'}</p>
        </div>

        <div style={{display:'flex',gap:'8px',marginBottom:'24px',background:'#0f1011',padding:'6px',borderRadius:'10px',width:'fit-content',border:'1px solid rgba(255,255,255,0.06)'}}>
          {['overview','historial','revelados','equipo','cuenta'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabBtn(t)}>
              {t === 'overview' ? 'Resumen' : t === 'historial' ? 'Búsquedas' : t === 'revelados' ? 'Revelados' : t === 'equipo' ? 'Equipo' : 'Mi cuenta'}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
              {[
                {label:'Créditos disponibles',value:suscripcion?.creditos?.toLocaleString() || '0',color:'#0cc0df'},
                {label:'Búsquedas este mes',value:suscripcion?.busquedas_usadas || '0',color:'#fff'},
                {label:'Prospectos revelados',value:revelados.length,color:'#fff'},
                {label:'Miembros del equipo',value:equipo.length,color:'#fff'},
              ].map((stat,i) => (
                <div key={i} style={card}>
                  <div style={{fontSize:'11px',color:'#6b7280',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>{stat.label}</div>
                  <div style={{fontSize:'28px',fontWeight:'600',color:stat.color}}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={{...card}}>
              <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Últimas búsquedas</h3>
              {historial.length === 0 ? <p style={{color:'#6b7280',fontSize:'13px'}}>No hay búsquedas registradas aún.</p> : (
                <div style={{display:'flex',flexDirection:'column' as const,gap:'8px'}}>
                  {historial.slice(0,5).map((h,i) => (
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',background:'#08090a',borderRadius:'8px',fontSize:'13px'}}>
                      <span style={{color:'#e8e8e8'}}>{JSON.stringify(h.filtros).slice(0,60)}...</span>
                      <span style={{color:'#6b7280',flexShrink:0,marginLeft:'16px'}}>{new Date(h.created_at).toLocaleDateString('es-MX')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'historial' && (
          <div style={card}>
            <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Historial de búsquedas</h3>
            {historial.length === 0 ? <p style={{color:'#6b7280',fontSize:'13px'}}>No hay búsquedas registradas.</p> : (
              <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    {['Filtros','Resultados','Créditos usados','Fecha'].map(h => <th key={h} style={{textAlign:'left' as const,padding:'8px 12px',fontSize:'11px',color:'#6b7280',textTransform:'uppercase' as const,letterSpacing:'1px'}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h,i) => (
                    <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                      <td style={{padding:'10px 12px',fontSize:'12px',color:'#e8e8e8'}}>{JSON.stringify(h.filtros).slice(0,80)}</td>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#0cc0df'}}>{h.total_resultados}</td>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#e8e8e8'}}>{h.creditos_usados}</td>
                      <td style={{padding:'10px 12px',fontSize:'12px',color:'#6b7280'}}>{new Date(h.created_at).toLocaleDateString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'revelados' && (
          <div style={card}>
            <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Datos revelados</h3>
            {revelados.length === 0 ? <p style={{color:'#6b7280',fontSize:'13px'}}>No has revelado datos aún.</p> : (
              <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    {['Empresa','Contacto','Tipo','Dato','Fecha'].map(h => <th key={h} style={{textAlign:'left' as const,padding:'8px 12px',fontSize:'11px',color:'#6b7280',textTransform:'uppercase' as const,letterSpacing:'1px'}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {revelados.map((r,i) => (
                    <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#e8e8e8'}}>{r.empresa}</td>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#e8e8e8'}}>{r.contacto}</td>
                      <td style={{padding:'10px 12px'}}><span style={{fontSize:'11px',background:r.tipo==='email'?'rgba(12,192,223,0.1)':'rgba(255,255,255,0.05)',color:r.tipo==='email'?'#0cc0df':'#6b7280',padding:'2px 8px',borderRadius:'4px'}}>{r.tipo}</span></td>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#0cc0df'}}>{r.email || r.telefono}</td>
                      <td style={{padding:'10px 12px',fontSize:'12px',color:'#6b7280'}}>{new Date(r.created_at).toLocaleDateString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'equipo' && (
          <div>
            <div style={{...card,marginBottom:'16px'}}>
              <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Agregar miembro al equipo</h3>
              <div style={{display:'flex',gap:'12px',alignItems:'flex-end'}}>
                <div style={{flex:1}}><label style={{display:'block',fontSize:'11px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase' as const,letterSpacing:'1px'}}>Email del usuario</label><input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="usuario@empresa.com" style={{width:'100%',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
                <div><label style={{display:'block',fontSize:'11px',color:'#6b7280',marginBottom:'6px',textTransform:'uppercase' as const,letterSpacing:'1px'}}>Créditos</label><input type="number" value={newCreditos} onChange={e => setNewCreditos(Number(e.target.value))} style={{width:'100px',background:'#08090a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'14px',outline:'none'}} /></div>
                <button onClick={agregarUsuario} style={{background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'13px',padding:'10px 20px',borderRadius:'8px',border:'none',cursor:'pointer',whiteSpace:'nowrap' as const}}>Agregar</button>
              </div>
            </div>
            <div style={card}>
              <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Miembros del equipo ({equipo.length})</h3>
              {equipo.length === 0 ? <p style={{color:'#6b7280',fontSize:'13px'}}>No hay miembros en tu equipo.</p> : (
                <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                  <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{['Email','Créditos asignados','Créditos usados','Estado'].map(h => <th key={h} style={{textAlign:'left' as const,padding:'8px 12px',fontSize:'11px',color:'#6b7280',textTransform:'uppercase' as const,letterSpacing:'1px'}}>{h}</th>)}</tr></thead>
                  <tbody>{equipo.map((u,i) => (
                    <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#e8e8e8'}}>{u.user_email}</td>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#0cc0df'}}>{u.creditos_asignados}</td>
                      <td style={{padding:'10px 12px',fontSize:'13px',color:'#e8e8e8'}}>{u.creditos_usados}</td>
                      <td style={{padding:'10px 12px'}}><span style={{fontSize:'11px',background:u.activo?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)',color:u.activo?'#22c55e':'#6b7280',padding:'2px 8px',borderRadius:'4px'}}>{u.activo?'Activo':'Inactivo'}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'cuenta' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div style={card}>
              <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Plan activo</h3>
              <div style={{fontSize:'24px',fontWeight:'700',color:'#0cc0df',marginBottom:'4px',textTransform:'capitalize' as const}}>{suscripcion?.plan || 'Free'}</div>
              <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'16px'}}>Estado: {suscripcion?.status || 'Sin suscripción'}</div>
              {suscripcion?.fecha_vencimiento && (
                <div style={{fontSize:'13px',color:diasRestantes && diasRestantes <= 5 ? '#fb923c' : '#6b7280'}}>
                  Vence: {new Date(suscripcion.fecha_vencimiento).toLocaleDateString('es-MX')}
                  {diasRestantes !== null && <span style={{marginLeft:'8px',fontWeight:'600'}}>({diasRestantes} días)</span>}
                </div>
              )}
              <button onClick={() => router.push('/planes')} style={{marginTop:'16px',width:'100%',background:'#0cc0df',color:'#000',fontWeight:'600',fontSize:'13px',padding:'10px',borderRadius:'8px',border:'none',cursor:'pointer'}}>Ver planes y renovar</button>
            </div>
            <div style={card}>
              <h3 style={{fontSize:'14px',fontWeight:'600',color:'#fff',marginBottom:'16px'}}>Información de cuenta</h3>
              <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'8px'}}>Email</div>
              <div style={{fontSize:'14px',color:'#e8e8e8',marginBottom:'16px'}}>{user?.email}</div>
              <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'8px'}}>Miembro desde</div>
              <div style={{fontSize:'14px',color:'#e8e8e8'}}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('es-MX') : 'N/A'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}