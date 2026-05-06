import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { busqueda, industria, departamento, headcount, estado, seniority, keywords, coords } = body

    // ── APOLLO ──────────────────────────────────────────
    const payload: Record<string, any> = {
      page: 1,
      per_page: 25,
      person_locations: estado && estado !== 'Todo México' ? [estado + ', Mexico'] : ['Mexico'],
    }

    if (busqueda) payload.q_keywords = busqueda
    if (keywords) payload.q_keywords = keywords

    if (departamento && departamento !== 'Todos los departamentos') {
      const map: Record<string, string[]> = {
        'Recursos Humanos': ['human_resources'],
        'Compras y Adquisiciones': ['operations'],
        'Logística': ['operations'],
        'Dirección General': ['c_suite'],
        'Finanzas': ['finance'],
        'Marketing': ['marketing'],
        'Ventas': ['sales'],
        'Tecnología': ['information_technology'],
        'Operaciones': ['operations'],
      }
      if (map[departamento]) payload.person_functions = map[departamento]
    }

    if (seniority && seniority !== 'Cualquier nivel') {
      const map: Record<string, string[]> = {
        'Director / C-Level': ['c_suite', 'vp', 'director'],
        'Gerente / Manager': ['manager'],
        'Coordinador / Supervisor': ['senior'],
        'Ejecutivo / Analista': ['entry'],
      }
      if (map[seniority]) payload.person_seniorities = map[seniority]
    }

    if (headcount && headcount !== 'Cualquier tamaño') {
      const map: Record<string, string[]> = {
        '1 - 10 empleados': ['1,10'],
        '11 - 50 empleados': ['11,50'],
        '51 - 200 empleados': ['51,200'],
        '201 - 500 empleados': ['201,500'],
        '501 - 1,000 empleados': ['501,1000'],
        '1,001 - 5,000 empleados': ['1001,5000'],
        '5,000+ empleados': ['5001,10000'],
      }
      if (map[headcount]) payload.organization_num_employees_ranges = map[headcount]
    }

    if (industria && industria !== 'Todas las industrias') {
      const map: Record<string, string[]> = {
        'Transporte y Logística': ['Transportation', 'Logistics and Supply Chain'],
        'Manufactura': ['Manufacturing'],
        'Construcción': ['Construction'],
        'Retail y Comercio': ['Retail'],
        'Restaurantes y Alimentos': ['Food & Beverages'],
        'Salud y Farmacia': ['Hospital & Health Care'],
        'Educación': ['Education Management'],
        'Tecnología': ['Information Technology and Services'],
        'Servicios Financieros': ['Financial Services'],
        'Automotriz': ['Automotive'],
        'Energía': ['Oil & Energy'],
        'Consultoría': ['Management Consulting'],
        'Telecomunicaciones': ['Telecommunications'],
      }
      if (map[industria]) payload.organization_industry_tag_ids = map[industria]
    }

    // ── GOOGLE MAPS (si hay coords) ──────────────────────
    let googleResults: any[] = []
    if (coords?.lat && coords?.lng) {
      try {
        const keyword = busqueda || industria || 'empresa'
        const radius = Math.round((coords.radio || 1) * 1000)
        const mapsUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + coords.lat + ',' + coords.lng + '&radius=' + radius + '&keyword=' + encodeURIComponent(keyword) + '&language=es&key=' + (process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '')
        const mapsRes = await fetch(mapsUrl)
        const mapsData = await mapsRes.json()
        googleResults = (mapsData.results || []).slice(0, 10).map((place: any) => ({
          id: 'maps_' + place.place_id,
          empresa: place.name,
          industria: place.types?.[0]?.replace(/_/g, ' ') || 'Local',
          ciudad: place.vicinity || estado || 'México',
          distancia: calcDistancia(coords.lat, coords.lng, place.geometry?.location?.lat, place.geometry?.location?.lng),
          empleados: 'Sin datos',
          contacto: 'Sin datos',
          cargo: 'Sin datos',
          email: null,
          emailOculto: true,
          telefono: null,
          telefonoOculto: true,
          linkedin: null,
          score: place.rating ? Math.round(place.rating * 18) : 50,
          fuente: 'Google Maps',
        }))
      } catch (e) {
        console.error('Google Maps error:', e)
      }
    }

    // ── APOLLO SEARCH ────────────────────────────────────
    let apolloResults: any[] = []
    try {
      const response = await fetch('https://api.apollo.io/v1/mixed_people/api_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.APOLLO_API_KEY || '',
        },
        body: JSON.stringify(payload),
      })
      const text = await response.text()
      if (response.ok) {
        const data = JSON.parse(text)
        const people = data.people || []
        apolloResults = people.map((p: any) => ({
          id: p.id || Math.random().toString(),
          empresa: p.organization?.name || 'Sin nombre',
          industria: p.organization?.industry || 'Sin clasificar',
          ciudad: p.city || p.state || 'México',
          empleados: formatEmpleados(p.organization?.estimated_num_employees),
          contacto: ((p.first_name || '') + ' ' + (p.last_name || '')).trim() || 'Sin nombre',
          cargo: p.title || 'Sin cargo',
          email: p.email || null,
          emailOculto: true,
          telefono: p.phone_numbers?.[0]?.sanitized_number || null,
          telefonoOculto: true,
          linkedin: p.linkedin_url || null,
          score: calcScore(p),
          fuente: 'Apollo',
        }))
      }
    } catch (e) {
      console.error('Apollo error:', e)
    }

    // ── HUNTER.IO (verifica emails de Apollo) ────────────
    const hunterKey = process.env.HUNTER_API_KEY || ''
    if (hunterKey && apolloResults.length > 0) {
      const topResults = apolloResults.slice(0, 5)
      await Promise.all(topResults.map(async (r: any) => {
        if (!r.email && r.empresa) {
          try {
            const domain = r.empresa.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.mx'
            const hunterUrl = 'https://api.hunter.io/v2/domain-search?domain=' + domain + '&api_key=' + hunterKey + '&limit=1'
            const hunterRes = await fetch(hunterUrl)
            const hunterData = await hunterRes.json()
            const firstEmail = hunterData.data?.emails?.[0]
            if (firstEmail) {
              r.email = firstEmail.value
              r.score = Math.min(r.score + 15, 100)
            }
          } catch {}
        }
      }))
    }

    
    // ── DENUE INEGI ─────────────────────────────────────
    let denueResults: any[] = []
    try {
      const token = process.env.DENUE_TOKEN || ''
      const q = busqueda || industria || 'empresa'
      const entidad = estado && estado !== 'Todo México' ? '09' : '00'
      const denueUrl = 'https://www.inegi.org.mx/app/api/denue/v1/consulta/BuscarAreaActividadDescripcion/' + encodeURIComponent(q) + '/' + entidad + '/0/0/1/25/0/0/0/0/' + token
      const denueRes = await fetch(denueUrl)
      if (denueRes.ok) {
        const denueData = await denueRes.json()
        denueResults = (Array.isArray(denueData) ? denueData : []).slice(0, 10).map((e: any) => ({
          id: 'denue_' + e.id,
          empresa: e.nom_estab || 'Sin nombre',
          industria: e.nombre_act || 'Sin clasificar',
          ciudad: (e.municipio || '') + ', ' + (e.entidad || ''),
          empleados: e.per_ocu || 'Sin datos',
          contacto: 'Sin datos',
          cargo: 'Sin datos',
          email: null,
          emailOculto: true,
          telefono: e.telefono || null,
          telefonoOculto: true,
          linkedin: null,
          score: e.telefono ? 60 : 40,
          fuente: 'DENUE INEGI',
        }))
      }
    } catch (e) {
      console.error('DENUE error:', e)
    }

    const resultados = [...googleResults, ...apolloResults, ...denueResults]

    if (resultados.length === 0) {
      return NextResponse.json({ error: 'No se encontraron resultados. Intenta con otros filtros.' })
    }

    return NextResponse.json({ resultados, total: resultados.length })

  } catch (err: any) {
    console.error('Error interno:', err)
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
  }
}

function calcDistancia(lat1: number, lng1: number, lat2: number, lng2: number): string {
  if (!lat2 || !lng2) return 'N/A'
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return d < 1000 ? Math.round(d) + ' m' : (d/1000).toFixed(1) + ' km'
}

function formatEmpleados(n: number | undefined): string {
  if (!n) return 'Sin datos'
  if (n <= 10) return '1 - 10'
  if (n <= 50) return '11 - 50'
  if (n <= 200) return '51 - 200'
  if (n <= 500) return '201 - 500'
  if (n <= 1000) return '501 - 1,000'
  if (n <= 5000) return '1,001 - 5,000'
  return '5,000+'
}

function calcScore(p: any): number {
  let s = 0
  if (p.email) s += 35
  if (p.linkedin_url) s += 20
  if (p.phone_numbers?.length) s += 15
  const t = (p.title || '').toLowerCase()
  if (['director', 'gerente', 'manager', 'ceo', 'coo', 'hr', 'human', 'compras'].some(k => t.includes(k))) s += 30
  return Math.min(s, 100)
}
