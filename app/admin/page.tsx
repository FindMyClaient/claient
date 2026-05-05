'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Users, Filter, Download, ChevronDown, Eye, Bookmark, BookmarkCheck, X, ChevronRight, Navigation, Loader2 } from 'lucide-react'

const industriasList = [
  'Todas las industrias','Transporte y Logística','Manufactura','Construcción',
  'Retail y Comercio','Restaurantes y Alimentos','Salud y Farmacia','Educación',
  'Tecnología','Servicios Financieros','Hotelería y Turismo','Automotriz',
  'Agroindustria','Energía','Gobierno','Medios y Comunicación',
  'Bienes Raíces','Seguros','Consultoría','Telecomunicaciones',
]
const departamentosList = [
  'Todos los departamentos','Recursos Humanos','Compras y Adquisiciones',
  'Logística','Dirección General','Finanzas','Marketing','Ventas',
  'Tecnología','Operaciones','Legal','Administración',
]
const headcountList = [
  'Cualquier tamaño','1 - 10 empleados','11 - 50 empleados',
  '51 - 200 empleados','201 - 500 empleados','501 - 1,000 empleados',
  '1,001 - 5,000 empleados','5,000+ empleados',
]
const revenueList = [
  'Cualquier facturación','Menos de $1M MXN','$1M - $10M MXN',
  '$10M - $50M MXN','$50M - $200M MXN','$200M - $500M MXN','Más de $500M MXN',
]
const estadosList = [
  'Todo México','Ciudad de México','Nuevo León','Jalisco','Estado de México',
  'Querétaro','Guanajuato','Puebla','Coahuila','Chihuahua','Sonora',
  'Veracruz','Baja California','Tamaulipas','Sinaloa','Aguascalientes',
  'San Luis Potosí','Yucatán','Hidalgo','Michoacán',
]
const companyTypeList = [
  'Cualquier tipo','Sociedad Anónima (SA)','SA de CV','SAPI de CV','SRL de CV',
  'Asociación Civil (AC)','Persona Física con Actividad Empresarial',
  'Organismo Público','ONG / Fundación',
]
const foundedList = ['Cualquier fecha','Menos de 2 años','2 - 5 años','5 - 10 años','10 - 20 años','Más de 20 años']
const webTrafficList = ['Cualquier tráfico','Top 1,000 sitios MX','Top 10,000 sitios MX','Top 100,000 sitios MX','Con presencia web']
const seniorityList = ['Cualquier nivel','Director / C-Level','Gerente / Manager','Coordinador / Supervisor','Ejecutivo / Analista']
const radioOptions = [
  { label: '200 m', value: 0.2 },
  { label: '500 m', value: 0.5 },
  { label: '1 km', value: 1 },
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
]

type Resultado = {
  id: string
  empresa: string
  industria: string
  ciudad: string
  distancia?: string
  empleados: string
  contacto: string
  cargo: string
  email: string | null
  telefono: string | null
  emailOculto: boolean
  telefonoOculto: boolean
  score: number
  linkedin?: string
}

type Coords = { lat: number; lng: number; direccion: string }
type SavedSearch = { id: number; nombre: string; filtros: Record<string, string>; fecha: string }

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''

export default function Buscador() {
  const [busqueda, setBusqueda] = useState('')
  const [industria, setIndustria] = useState('Todas las industrias')
  const [departamento, setDepartamento] = useState('Todos los departamentos')
  const [headcount, setHeadcount] = useState('Cualquier tamaño')
  const [revenue, setRevenue] = useState('Cualquier facturación')
  const [estado, setEstado] = useState('Todo México')
  const [companyType, setCompanyType] = useState('Cualquier tipo')
  const [founded, setFounded] = useState('Cualquier fecha')
  const [webTraffic, setWebTraffic] = useState('Cualquier tráfico')
  const [seniority, setSeniority] = useState('Cualquier nivel')
  const [keywords, setKeywords] = useState('')
  const [flotilla, setFlotilla] = useState(false)
  const [linkedinPresence, setLinkedinPresence] = useState(false)
  const [soloVerificado, setSoloVerificado] = useState(false)

  const [coords, setCoords] = useState<Coords | null>(null)
  const [radioKm, setRadioKm] = useState<number>(1)
  const [modoGeo, setModoGeo] = useState(false)
  const [detectando, setDetectando] = useState(false)
  const [errorGeo, setErrorGeo] = useState('')
  const [direccionInput, setDireccionInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [mostrarSaved, setMostrarSaved] = useState(false)
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [error, setError] = useState('')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [creditos, setCreditos] = useState(1000)
  const [emailsRevelados, setEmailsRevelados] = useState<string[]>([])
  const [telefonosRevelados, setTelefonosRevelados] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: 1, nombre: 'Transporte Monterrey RH', filtros: { industria: 'Transporte y Logística', estado: 'Nuevo León' }, fecha: '28 abr 2026' },
  ])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as any).google?.maps) { setMapsLoaded(true); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setMapsLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current || autocompleteRef.current) return
    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'mx' },
    })
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const direccion = place.formatted_address || place.name || 'Dirección seleccionada'
      setCoords({ lat, lng, direccion })
      setDireccionInput(direccion)
      setModoGeo(true)
      setErrorGeo('')
    })
    autocompleteRef.current = autocomplete
  }, [mapsLoaded])

  const detectarGPS = () => {
    if (!navigator.geolocation) { setErrorGeo('Tu navegador no soporta geolocalización.'); return }
    setDetectando(true)
    setErrorGeo('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=es`)
          const data = await res.json()
          const direccion = data.results?.[0]?.formatted_address || 'Tu ubicación actual'
          setCoords({ lat: latitude, lng: longitude, direccion })
          setDireccionInput(direccion)
          setModoGeo(true)
        } catch {
          setCoords({ lat: latitude, lng: longitude, direccion: 'Tu ubicación actual' })
          setModoGeo(true)
        }
        setDetectando(false)
      },
      (err) => {
        setDetectando(false)
        if (err.code === 1) setErrorGeo('Permiso denegado. Permite acceso a tu ubicación.')
        else setErrorGeo('No se pudo detectar tu ubicación.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const limpiarGeo = () => {
    setCoords(null)
    setModoGeo(false)
    setDireccionInput('')
    setErrorGeo('')
    if (inputRef.current) inputRef.current.value = ''
  }

  // ── BÚSQUEDA REAL CON APOLLO API ──────────────────────────────
  const handleBuscar = async () => {
    setBuscando(true)
    setResultados([])
    setError('')
    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busqueda,
          industria,
          departamento,
          headcount,
          estado,
          seniority,
          keywords,
          flotilla,
          coords: modoGeo && coords ? { lat: coords.lat, lng: coords.lng, radio: radioKm } : null,
        }),
      })
      const data = await res.json()
      if (data.resultados && data.resultados.length > 0) {
        setResultados(data.resultados)
      } else if (data.error) {
        setError(data.error)
      } else {
        setError('No se encontraron resultados. Intenta con otros filtros.')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    }
    setBuscando(false)
  }

  const revelarEmail = (id: string) => {
    if (emailsRevelados.includes(id)) return
    if (creditos < 1) { alert('Sin créditos. Compra más para continuar.'); return }
    setEmailsRevelados(prev => [...prev, id])
    setCreditos(prev => prev - 1)
  }

  const revelarTelefono = (id: string) => {
    if (telefonosRevelados.includes(id)) return
    if (creditos < 1) { alert('Sin créditos. Compra más para continuar.'); return }
    setTelefonosRevelados(prev => [...prev, id])
    setCreditos(prev => prev - 1)
  }

  const toggleSeleccion = (id: string) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const exportarCSV = () => {
    const datos = seleccionados.length > 0 ? resultados.filter(r => seleccionados.includes(r.id)) : resultados
    const headers = ['Empresa', 'Industria', 'Ciudad', 'Empleados', 'Contacto', 'Cargo', 'Email', 'Telefono', 'Score']
    const filas = datos.map(r => [
      r.empresa, r.industria, r.ciudad, r.empleados, r.contacto, r.cargo,
      emailsRevelados.includes(r.id) ? r.email : '',
      telefonosRevelados.includes(r.id) ? r.telefono : '',
      r.score,
    ])
    const csv = [headers, ...filas].map(f => f.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'claient_prospectos.csv'
    a.click()
  }

  const guardarBusqueda = () => {
    if (!nombreBusqueda.trim()) return
    const nueva: SavedSearch = {
      id: Date.now(),
      nombre: nombreBusqueda,
      filtros: { busqueda, industria, departamento, headcount, estado },
      fecha: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    setSavedSearches(prev => [nueva, ...prev])
    setNombreBusqueda('')
    setGuardando(false)
  }

  const cargarBusqueda = (s: SavedSearch) => {
    if (s.filtros.busqueda) setBusqueda(s.filtros.busqueda)
    if (s.filtros.industria) setIndustria(s.filtros.industria)
    if (s.filtros.departamento) setDepartamento(s.filtros.departamento)
    if (s.filtros.headcount) setHeadcount(s.filtros.headcount)
    if (s.filtros.estado) setEstado(s.filtros.estado)
    setMostrarSaved(false)
    setMostrarFiltros(true)
  }

  const filtrosActivos = [
    modoGeo && coords && `📍 ${coords.direccion.substring(0, 25)}... · ${radioKm < 1 ? radioKm * 1000 + 'm' : radioKm + 'km'}`,
    industria !== 'Todas las industrias' && industria,
    departamento !== 'Todos los departamentos' && departamento,
    headcount !== 'Cualquier tamaño' && headcount,
    estado !== 'Todo México' && estado,
    seniority !== 'Cualquier nivel' && seniority,
    flotilla && 'Con flotilla',
    linkedinPresence && 'Con LinkedIn',
    soloVerificado && 'Email verificado',
    keywords && `"${keywords}"`,
  ].filter(Boolean) as string[]

  const limpiarTodo = () => {
    setIndustria('Todas las industrias'); setDepartamento('Todos los departamentos')
    setHeadcount('Cualquier tamaño'); setRevenue('Cualquier facturación')
    setEstado('Todo México'); setCompanyType('Cualquier tipo')
    setFounded('Cualquier fecha'); setSeniority('Cualquier nivel')
    setFlotilla(false); setLinkedinPresence(false); setSoloVerificado(false)
    setKeywords(''); limpiarGeo(); setResultados([]); setError('')
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/1.svg" alt="CLAIENT" className="h-35 w-auto" />
            <span className="text-xs text-[#0cc0df] border border-[#0cc0df]/30 rounded-full px-2 py-0.5">B2B Search</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/planes" className="text-xs text-white/40 hover:text-[#0cc0df] transition">Planes</a>
            <div className="flex items-center gap-2 text-white/40">
              <span>Créditos:</span>
              <span className={`font-bold text-base ${creditos < 100 ? 'text-red-400' : 'text-[#0cc0df]'}`}>{creditos.toLocaleString()}</span>
              <a href="/planes" className="text-xs text-[#0cc0df] border border-[#0cc0df]/30 rounded-full px-2 py-0.5 hover:bg-[#0cc0df]/10 transition">+ Comprar</a>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0cc0df] flex items-center justify-center text-black font-bold text-sm">R</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Buscar prospectos B2B</h1>
          <p className="text-white/40">Encuentra empresas y contactos clave en México y LATAM</p>
        </div>

        {/* Panel de ubicación */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#0cc0df]" />
            <span className="text-sm font-medium text-white">Búsqueda por ubicación</span>
            <span className="text-xs text-white/30">— encuentra empresas cerca de una dirección específica</span>
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 z-10" />
              <input ref={inputRef} type="text" placeholder="Escribe una dirección, colonia, empresa u oficina..." defaultValue={direccionInput} className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#0cc0df]/50 text-sm" />
            </div>
            <button onClick={detectarGPS} disabled={detectando} className="flex items-center gap-2 bg-[#141414] border border-white/10 px-4 py-3 rounded-xl text-sm hover:border-[#0cc0df]/40 hover:text-[#0cc0df] transition disabled:opacity-50 whitespace-nowrap">
              {detectando ? <Loader2 className="w-4 h-4 animate-spin text-[#0cc0df]" /> : <Navigation className="w-4 h-4" />}
              {detectando ? 'Detectando...' : 'Mi ubicación'}
            </button>
            {modoGeo && <button onClick={limpiarGeo} className="p-3 bg-[#141414] border border-white/10 rounded-xl text-white/30 hover:text-red-400 hover:border-red-400/30 transition"><X className="w-4 h-4" /></button>}
          </div>
          {errorGeo && <p className="text-xs text-red-400 mt-2">{errorGeo}</p>}
          {modoGeo && coords && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/40 uppercase tracking-wider">Radio de búsqueda</span>
                <span className="text-xs text-[#0cc0df] bg-[#0cc0df]/10 border border-[#0cc0df]/20 rounded-full px-2 py-0.5">{radioKm < 1 ? radioKm * 1000 + ' metros' : radioKm + ' km'}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {radioOptions.map(op => (
                  <button key={op.value} onClick={() => setRadioKm(op.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${radioKm === op.value ? 'bg-[#0cc0df] text-black' : 'bg-[#141414] text-white/50 hover:text-white border border-white/10 hover:border-[#0cc0df]/30'}`}>{op.label}</button>
                ))}
              </div>
              <p className="text-xs text-white/30 mt-2">📍 {coords.direccion}</p>
            </div>
          )}
        </div>

        {/* Barra principal */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input type="text" placeholder={modoGeo && coords ? `Busca en ${radioKm < 1 ? radioKm * 1000 + 'm' : radioKm + 'km'} alrededor...` : 'Busca por empresa, industria, cargo o producto...'} value={busqueda} onChange={e => setBusqueda(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleBuscar()} className="w-full bg-[#141414] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/25 focus:outline-none focus:border-[#0cc0df]/50 text-base" />
          </div>
          <button onClick={handleBuscar} disabled={buscando} className="bg-[#0cc0df] text-black font-bold px-8 py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm tracking-wide uppercase">
            {buscando ? 'Buscando...' : 'Buscar'}
          </button>
          <button onClick={() => { setMostrarFiltros(!mostrarFiltros); setMostrarSaved(false) }} className={`bg-[#141414] border px-5 py-4 rounded-xl transition flex items-center gap-2 text-sm ${mostrarFiltros ? 'border-[#0cc0df]/50 text-[#0cc0df]' : 'border-white/10 text-white/60 hover:border-[#0cc0df]/40'}`}>
            <Filter className="w-4 h-4" />Filtros
            {filtrosActivos.length > 0 && <span className="bg-[#0cc0df] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{filtrosActivos.length}</span>}
            <ChevronDown className={`w-4 h-4 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => { setMostrarSaved(!mostrarSaved); setMostrarFiltros(false) }} className={`bg-[#141414] border px-5 py-4 rounded-xl transition flex items-center gap-2 text-sm ${mostrarSaved ? 'border-[#0cc0df]/50 text-[#0cc0df]' : 'border-white/10 text-white/60 hover:border-[#0cc0df]/40'}`}>
            <Bookmark className="w-4 h-4" />Guardadas
            {savedSearches.length > 0 && <span className="bg-white/10 text-white/60 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{savedSearches.length}</span>}
          </button>
        </div>

        {/* Tags activos */}
        {filtrosActivos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filtrosActivos.map(f => <span key={f} className="text-xs bg-[#0cc0df]/10 text-[#0cc0df] border border-[#0cc0df]/20 rounded-full px-3 py-1">{f}</span>)}
            <button onClick={limpiarTodo} className="text-xs text-white/30 hover:text-white/60 transition px-2">Limpiar todo</button>
          </div>
        )}

        {/* Saved Searches */}
        {mostrarSaved && (
          <div className="bg-[#0d0d0d] border border-white/5 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Búsquedas guardadas</h3>
              <button onClick={() => setGuardando(!guardando)} className="flex items-center gap-1.5 text-xs text-[#0cc0df] border border-[#0cc0df]/30 rounded-lg px-3 py-1.5 hover:bg-[#0cc0df]/10 transition">
                <BookmarkCheck className="w-3.5 h-3.5" />Guardar búsqueda actual
              </button>
            </div>
            {guardando && (
              <div className="flex gap-2 mb-4 p-3 bg-[#141414] rounded-lg border border-white/5">
                <input type="text" placeholder="Nombre para esta búsqueda..." value={nombreBusqueda} onChange={e => setNombreBusqueda(e.target.value)} onKeyDown={e => e.key === 'Enter' && guardarBusqueda()} className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none" autoFocus />
                <button onClick={guardarBusqueda} className="text-xs bg-[#0cc0df] text-black font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition">Guardar</button>
                <button onClick={() => setGuardando(false)} className="text-white/30 hover:text-white/60 transition"><X className="w-4 h-4" /></button>
              </div>
            )}
            {savedSearches.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-6">No tienes búsquedas guardadas</p>
            ) : (
              <div className="space-y-2">
                {savedSearches.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-[#141414] rounded-lg border border-white/5 hover:border-[#0cc0df]/20 transition group">
                    <div className="flex-1 cursor-pointer" onClick={() => cargarBusqueda(s)}>
                      <div className="text-sm font-medium text-white group-hover:text-[#0cc0df] transition">{s.nombre}</div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {Object.values(s.filtros).filter(v => v).slice(0, 3).map((v, i) => <span key={i} className="text-xs text-white/30">{v as string}</span>)}
                        <span className="text-xs text-white/20">· {s.fecha}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => cargarBusqueda(s)} className="text-xs text-[#0cc0df]/60 hover:text-[#0cc0df] transition flex items-center gap-1">Cargar <ChevronRight className="w-3 h-3" /></button>
                      <button onClick={() => setSavedSearches(prev => prev.filter(x => x.id !== s.id))} className="text-white/20 hover:text-red-400 transition"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        {mostrarFiltros && (
          <div className="bg-[#0d0d0d] border border-white/5 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Industria</label><select value={industria} onChange={e => setIndustria(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{industriasList.map(i => <option key={i}>{i}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Departamento</label><select value={departamento} onChange={e => setDepartamento(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{departamentosList.map(d => <option key={d}>{d}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Headcount</label><select value={headcount} onChange={e => setHeadcount(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{headcountList.map(h => <option key={h}>{h}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Facturación</label><select value={revenue} onChange={e => setRevenue(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{revenueList.map(r => <option key={r}>{r}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Estado</label><select value={estado} onChange={e => setEstado(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{estadosList.map(e => <option key={e}>{e}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Tipo de empresa</label><select value={companyType} onChange={e => setCompanyType(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{companyTypeList.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Antigüedad</label><select value={founded} onChange={e => setFounded(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{foundedList.map(f => <option key={f}>{f}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Nivel del contacto</label><select value={seniority} onChange={e => setSeniority(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0cc0df]/50">{seniorityList.map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Palabras clave</label><input type="text" placeholder="Ej: flotilla, distribución..." value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#0cc0df]/50" /></div>
              <div className="flex flex-col gap-3 justify-end">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={flotilla} onChange={e => setFlotilla(e.target.checked)} className="accent-[#0cc0df]" /><span className="text-sm text-white/60">Tiene flotilla vehicular</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={linkedinPresence} onChange={e => setLinkedinPresence(e.target.checked)} className="accent-[#0cc0df]" /><span className="text-sm text-white/60">Con presencia en LinkedIn</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={soloVerificado} onChange={e => setSoloVerificado(e.target.checked)} className="accent-[#0cc0df]" /><span className="text-sm text-white/60">Solo email verificado</span></label>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {resultados.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-sm"><span className="text-white font-semibold">{resultados.length}</span> resultados encontrados</span>
                {seleccionados.length > 0 && <span className="text-[#0cc0df] text-sm">{seleccionados.length} seleccionados</span>}
              </div>
              <button onClick={exportarCSV} className="flex items-center gap-2 bg-[#141414] border border-white/10 px-4 py-2 rounded-lg text-sm hover:border-[#0cc0df]/40 transition">
                <Download className="w-4 h-4 text-[#0cc0df]" />Exportar CSV
              </button>
            </div>
            <div className="bg-[#0d0d0d] border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="w-10 px-4 py-3"><input type="checkbox" className="accent-[#0cc0df]" onChange={e => setSeleccionados(e.target.checked ? resultados.map(r => r.id) : [])} /></th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Empresa</th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Ciudad</th>
                      {modoGeo && <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Distancia</th>}
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Empleados</th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Contacto</th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Cargo</th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Email <span className="text-[#0cc0df]/50 normal-case font-normal">· 1 crédito</span></th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Teléfono <span className="text-[#0cc0df]/50 normal-case font-normal">· 1 crédito</span></th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((r) => (
                      <tr key={r.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition ${seleccionados.includes(r.id) ? 'bg-[#0cc0df]/5' : ''}`}>
                        <td className="px-4 py-4"><input type="checkbox" checked={seleccionados.includes(r.id)} onChange={() => toggleSeleccion(r.id)} className="accent-[#0cc0df]" /></td>
                        <td className="px-4 py-4 min-w-[200px]">
                          <div className="font-semibold text-sm text-white">{r.empresa}</div>
                          <div className="text-xs text-[#0cc0df]/70 mt-1">{r.industria}</div>
                        </td>
                        <td className="px-4 py-4 min-w-[140px]">
                          <div className="text-sm text-white flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />{r.ciudad}</div>
                        </td>
                        {modoGeo && (
                          <td className="px-4 py-4 min-w-[100px]">
                            <span className="text-xs bg-[#0cc0df]/10 text-[#0cc0df] border border-[#0cc0df]/20 rounded-full px-2 py-0.5">{r.distancia || 'N/A'}</span>
                          </td>
                        )}
                        <td className="px-4 py-4 min-w-[120px]">
                          <div className="text-sm text-white flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />{r.empleados}</div>
                        </td>
                        <td className="px-4 py-4 min-w-[150px]"><div className="text-sm font-medium text-white">{r.contacto}</div></td>
                        <td className="px-4 py-4 min-w-[200px]"><div className="text-sm text-white/70">{r.cargo}</div></td>
                        <td className="px-4 py-4 min-w-[220px]">
                          {emailsRevelados.includes(r.id) ? (
                            <div className="text-sm text-white/80">{r.email || 'No disponible'}</div>
                          ) : (
                            <button onClick={() => revelarEmail(r.id)} className="flex items-center gap-1.5 text-xs text-[#0cc0df] border border-[#0cc0df]/30 rounded-lg px-2.5 py-1.5 hover:bg-[#0cc0df]/10 transition">
                              <Eye className="w-3.5 h-3.5" />Revelar email
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4 min-w-[180px]">
                          {telefonosRevelados.includes(r.id) ? (
                            <div className="text-sm text-white/80">{r.telefono || 'No disponible'}</div>
                          ) : (
                            <button onClick={() => revelarTelefono(r.id)} className="flex items-center gap-1.5 text-xs text-[#0cc0df] border border-[#0cc0df]/30 rounded-lg px-2.5 py-1.5 hover:bg-[#0cc0df]/10 transition">
                              <Eye className="w-3.5 h-3.5" />Revelar tel.
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${r.score >= 90 ? 'bg-emerald-500/20 text-emerald-400' : r.score >= 75 ? 'bg-[#0cc0df]/20 text-[#0cc0df]' : 'bg-white/10 text-white/60'}`}>{r.score}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-white/30 mt-3 text-center">Revelar email o teléfono cuesta 1 crédito · Solo los datos revelados aparecen en la exportación CSV</p>
          </div>
        )}

        {/* Error */}
        {error && !buscando && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sin resultados</h3>
            <p className="text-white/40 text-sm max-w-md mx-auto">{error}</p>
          </div>
        )}

        {/* Estado vacío */}
        {resultados.length === 0 && !buscando && !error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#0cc0df]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#0cc0df]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Empieza tu búsqueda</h3>
            <p className="text-white/40 text-sm max-w-md mx-auto">Escribe una dirección para buscar por radio, usa los filtros, o escribe directamente en el buscador</p>
          </div>
        )}

        {/* Buscando */}
        {buscando && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#0cc0df]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="w-8 h-8 text-[#0cc0df]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Buscando prospectos...</h3>
            <p className="text-white/40 text-sm">Consultando Apollo, LinkedIn, Google Maps e IMSS</p>
          </div>
        )}
      </div>
    </div>
  )
}