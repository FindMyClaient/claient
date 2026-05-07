import { NextRequest, NextResponse } from 'next/server'

function isEmailValido(email: string | null | undefined): boolean {
  if (!email) return false
  const e = email.toLowerCase().trim()
  if (e.includes('email_not_unlocked') || e.includes('not_unlocked') || e.includes('domain.com')) return false
  if (e.length < 5 || !e.includes('@')) return false
  return true
}

function limpiarEmail(email: string | null | undefined): string | null {
  if (!isEmailValido(email)) return null
  return email!.toLowerCase().trim()
}

function isEmailGenerico(email: string): boolean {
  const e = email.toLowerCase().trim()
  const prefijos = ['info@', 'contacto@', 'contact@', 'ventas@', 'sales@', 'admin@', 'soporte@', 'support@', 'hola@', 'hello@', 'rh@', 'rrhh@', 'hr@', 'trabajo@', 'jobs@', 'careers@', 'noreply@', 'no-reply@']
  return prefijos.some(p => e.startsWith(p))
}

async function getApolloDomain(empresa: string, apiKey: string): Promise<string | null> {
  try {
    const url = 'https://api.apollo.io/v1/organizations/search'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
      body: JSON.stringify({ q_organization_name: empresa, page: 1, per_page: 1 }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const org = data.organizations?.[0] || data.accounts?.[0]
    if (!org) return null
    const domain = org.primary_domain || org.website_url || null
    if (!domain) return null
    return domain.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  } catch { return null }
}

export async function POST(req: NextRequest) {
  const fuentesUsadas: Record<string, { resultados: number; status: string }> = {}

  try {
    const body = await req.json()
    const { busqueda, industria, departamento, headcount, estado, seniority, keywords, coords } = body

    const payload: Record<string, any> = {
      page: 1, per_page: 25,
      person_locations: estado && estado !== 'Todo México' ? [estado + ', Mexico'] : ['Mexico'],
    }
    if (busqueda) payload.q_keywords = busqueda
    if (keywords) payload.q_keywords = keywords
    if (departamento && departamento !== 'Todos los departamentos') {
      const map: Record<string, string[]> = {
        'Recursos Humanos': ['human_resources'],'Compras y Adquisiciones': ['operations'],
        'Logística': ['operations'],'Dirección General': ['c_suite'],'Finanzas': ['finance'],
        'Marketing': ['marketing'],'Ventas': ['sales'],'Tecnología': ['information_technology'],'Operaciones': ['operations'],
      }
      if (map[departamento]) payload.person_functions = map[departamento]
    }
    if (seniority && seniority !== 'Cualquier nivel') {
      const map: Record<string, string[]> = {
        'Director / C-Level': ['c_suite', 'vp', 'director'],'Gerente / Manager': ['manager'],
        'Coordinador / Supervisor': ['senior'],'Ejecutivo / Analista': ['entry'],
      }
      if (map[seniority]) payload.person_seniorities = map[seniority]
    }
    if (headcount && headcount !== 'Cualquier tamaño') {
      const map: Record<string, string[]> = {
        '1 - 10 empleados': ['1,10'],'11 - 50 empleados': ['11,50'],'51 - 200 empleados': ['51,200'],
        '201 - 500 empleados': ['201,500'],'501 - 1,000 empleados': ['501,1000'],
        '1,001 - 5,000 empleados': ['1001,5000'],'5,000+ empleados': ['5001,10000'],
      }
      if (map[headcount]) payload.organization_num_employees_ranges = map[headcount]
    }

    let googleResults: any[] = []
    if (coords?.lat && coords?.lng) {
      try {
        const keyword = busqueda || industria || 'empresa'
        const radius = Math.round((coords.radio || 1) * 1000)
        const mapsUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + coords.lat + ',' + coords.lng + '&radius=' + radius + '&keyword=' + encodeURIComponent(keyword) + '&language=es&key=' + (process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '')
        const mapsRes = await fetch(mapsUrl)
        const mapsData = await mapsRes.json()
        googleResults = (mapsData.results || []).slice(0, 10).map((place: any) => ({
          id: 'maps_' + place.place_id, empresa: place.name,
          industria: place.types?.[0]?.replace(/_/g, ' ') || 'Local',
          ciudad: place.vicinity || estado || 'México',
          distancia: calcDistancia(coords.lat, coords.lng, place.geometry?.location?.lat, place.geometry?.location?.lng),
          empleados: 'Sin datos', contacto: 'Sin datos', cargo: 'Sin datos',
          email: null, emailOculto: true, emailFuente: null,
          telefono: null, telefonoOculto: true, telefonoFuente: null,
          linkedin: null, score: place.rating ? Math.round(place.rating * 18) : 50, fuente: 'Google Maps',
        }))
        fuentesUsadas['Google Maps'] = { resultados: googleResults.length, status: 'ok' }
      } catch { fuentesUsadas['Google Maps'] = { resultados: 0, status: 'error' } }
    }

    let apolloResults: any[] = []
    const apolloKey = process.env.APOLLO_API_KEY || ''
    try {
      const response = await fetch('https://api.apollo.io/v1/mixed_people/api_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apolloKey },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        const data = await response.json()
        apolloResults = (data.people || []).map((p: any) => ({
          id: p.id || Math.random().toString(),
          empresa: p.organization?.name || 'Sin nombre',
          industria: p.organization?.industry || 'Sin clasificar',
          ciudad: p.city || p.state || 'México',
          empleados: formatEmpleados(p.organization?.estimated_num_employees),
          contacto: ((p.first_name || '') + ' ' + (p.last_name || '')).trim() || 'Sin nombre',
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          cargo: p.title || 'Sin cargo',
          email: limpiarEmail(p.email),
          emailOculto: true,
          emailFuente: limpiarEmail(p.email) ? 'Apollo' : null,
          telefono: p.phone_numbers?.[0]?.sanitized_number || null,
          telefonoOculto: true,
          telefonoFuente: p.phone_numbers?.[0]?.sanitized_number ? 'Apollo' : null,
          linkedin: p.linkedin_url || null,
          score: calcScore(p),
          fuente: 'Apollo',
          empresa_dominio: p.organization?.primary_domain || p.organization?.website_url || null,
        }))
        fuentesUsadas['Apollo'] = { resultados: apolloResults.length, status: 'ok' }
      } else {
        fuentesUsadas['Apollo'] = { resultados: 0, status: 'error' }
      }
    } catch { fuentesUsadas['Apollo'] = { resultados: 0, status: 'error' } }

    const empresasUnicas = Array.from(new Set(apolloResults.filter(r => !r.empresa_dominio).map(r => r.empresa)))
    const dominiosMap = new Map<string, string>()
    if (apolloKey && empresasUnicas.length > 0) {
      await Promise.all(empresasUnicas.slice(0, 10).map(async (empresa) => {
        const domain = await getApolloDomain(empresa as string, apolloKey)
        if (domain) dominiosMap.set(empresa as string, domain)
      }))
      apolloResults.forEach((r: any) => {
        if (!r.empresa_dominio && dominiosMap.has(r.empresa)) {
          r.empresa_dominio = dominiosMap.get(r.empresa)
        } else if (r.empresa_dominio) {
          r.empresa_dominio = r.empresa_dominio.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        }
      })
    }

    const prospeoKey = process.env.PROSPEO_API_KEY || ''
    let prospeoCount = 0
    if (prospeoKey && apolloResults.length > 0) {
      const sinEmail = apolloResults.filter((r: any) => !r.email && r.first_name && r.last_name && r.empresa_dominio).slice(0, 10)
      await Promise.all(sinEmail.map(async (r: any) => {
        try {
          const url = 'https://api.prospeo.io/email-finder'
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-KEY': prospeoKey },
            body: JSON.stringify({
              first_name: r.first_name, last_name: r.last_name,
              company: r.empresa, domain: r.empresa_dominio,
            }),
          })
          if (res.ok) {
            const data = await res.json()
            const found = data?.response?.email
            if (found && isEmailValido(found) && !isEmailGenerico(found)) {
              r.email = found
              r.emailFuente = 'Prospeo'
              r.score = Math.min(r.score + 25, 100)
              prospeoCount++
            }
          }
        } catch {}
      }))
      fuentesUsadas['Prospeo'] = { resultados: prospeoCount, status: 'ok' }
    }

    const snovUser = process.env.SNOV_USER_ID || ''
    const snovSecret = process.env.SNOV_SECRET || ''
    let snovCount = 0
    if (snovUser && snovSecret && apolloResults.length > 0) {
      try {
        const tokenRes = await fetch('https://api.snov.io/v1/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'grant_type=client_credentials&client_id=' + snovUser + '&client_secret=' + snovSecret,
        })
        const tokenData = await tokenRes.json()
        const accessToken = tokenData.access_token
        if (accessToken) {
          const sinEmail = apolloResults.filter((r: any) => !r.email && r.first_name && r.last_name && r.empresa_dominio).slice(0, 5)
          await Promise.all(sinEmail.map(async (r: any) => {
            try {
              const snovUrl = 'https://api.snov.io/v1/get-emails-from-names?access_token=' + accessToken + '&firstName=' + encodeURIComponent(r.first_name) + '&lastName=' + encodeURIComponent(r.last_name) + '&domain=' + encodeURIComponent(r.empresa_dominio)
              const snovRes = await fetch(snovUrl)
              if (snovRes.ok) {
                const snovData = await snovRes.json()
                const emails = snovData?.emails || []
                const valid = emails.find((e: any) => isEmailValido(e.email) && !isEmailGenerico(e.email))?.email
                if (valid) {
                  r.email = valid
                  r.emailFuente = 'Snov.io'
                  r.score = Math.min(r.score + 20, 100)
                  snovCount++
                }
              }
            } catch {}
          }))
        }
        fuentesUsadas['Snov.io'] = { resultados: snovCount, status: 'ok' }
      } catch { fuentesUsadas['Snov.io'] = { resultados: 0, status: 'error' } }
    }

    const hunterKey = process.env.HUNTER_API_KEY || ''
    let hunterCount = 0
    if (hunterKey && apolloResults.length > 0) {
      const sinEmail = apolloResults.filter((r: any) => !r.email && r.first_name && r.last_name && r.empresa_dominio).slice(0, 5)
      await Promise.all(sinEmail.map(async (r: any) => {
        try {
          const url = 'https://api.hunter.io/v2/email-finder?domain=' + encodeURIComponent(r.empresa_dominio) + '&first_name=' + encodeURIComponent(r.first_name) + '&last_name=' + encodeURIComponent(r.last_name) + '&api_key=' + hunterKey
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            const found = data?.data?.email
            const score = data?.data?.score || 0
            if (found && isEmailValido(found) && score >= 50 && !isEmailGenerico(found)) {
              r.email = found
              r.emailFuente = 'Hunter.io'
              r.score = Math.min(r.score + 15, 100)
              hunterCount++
            }
          }
        } catch {}
      }))
      fuentesUsadas['Hunter.io'] = { resultados: hunterCount, status: 'ok' }
    }

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
          id: 'denue_' + e.id, empresa: e.nom_estab || 'Sin nombre',
          industria: e.nombre_act || 'Sin clasificar',
          ciudad: (e.municipio || '') + ', ' + (e.entidad || ''),
          empleados: e.per_ocu || 'Sin datos', contacto: 'Sin datos', cargo: 'Sin datos',
          email: null, emailOculto: true, emailFuente: null,
          telefono: e.telefono || null, telefonoOculto: true, telefonoFuente: e.telefono ? 'DENUE INEGI' : null,
          linkedin: null, score: e.telefono ? 60 : 40, fuente: 'DENUE INEGI',
        }))
        fuentesUsadas['DENUE INEGI'] = { resultados: denueResults.length, status: 'ok' }
      } else {
        fuentesUsadas['DENUE INEGI'] = { resultados: 0, status: 'error' }
      }
    } catch { fuentesUsadas['DENUE INEGI'] = { resultados: 0, status: 'error' } }

    let rrResults: any[] = []
    try {
      const rrKey = process.env.ROCKETREACH_API_KEY || ''
      if (rrKey) {
        const rrPayload: any = { start: 1, pageSize: 10 }
        if (busqueda) rrPayload.name = busqueda
        rrPayload.location = estado && estado !== 'Todo México' ? [estado + ', Mexico'] : ['Mexico']
        const rrRes = await fetch('https://api.rocketreach.co/v2/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Api-Key': rrKey },
          body: JSON.stringify({ query: rrPayload }),
        })
        if (rrRes.ok) {
          const rrData = await rrRes.json()
          rrResults = (rrData.profiles || []).slice(0, 10).map((p: any) => ({
            id: 'rr_' + (p.id || Math.random()), empresa: p.current_employer || 'Sin nombre',
            industria: p.industry || 'Sin clasificar', ciudad: p.location || estado || 'México',
            empleados: 'Sin datos', contacto: ((p.first_name || '') + ' ' + (p.last_name || '')).trim(),
            cargo: p.current_title || 'Sin cargo',
            email: limpiarEmail(p.email), emailOculto: true,
            emailFuente: limpiarEmail(p.email) ? 'RocketReach' : null,
            telefono: null, telefonoOculto: true, telefonoFuente: null,
            linkedin: p.linkedin_url || null, score: p.email ? 80 : 50, fuente: 'RocketReach',
          }))
          fuentesUsadas['RocketReach'] = { resultados: rrResults.length, status: 'ok' }
        }
      }
    } catch { fuentesUsadas['RocketReach'] = { resultados: 0, status: 'error' } }

    let pdlResults: any[] = []
    try {
      const pdlKey = process.env.PDL_API_KEY || ''
      if (pdlKey) {
        const pdlQuery: any = { location_country: 'mexico', size: 10 }
        if (busqueda) pdlQuery.job_company_name = busqueda
        const pdlRes = await fetch('https://api.peopledatalabs.com/v5/person/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Api-Key': pdlKey },
          body: JSON.stringify({ query: pdlQuery, size: 10, dataset: 'all' }),
        })
        if (pdlRes.ok) {
          const pdlData = await pdlRes.json()
          pdlResults = (pdlData.data || []).slice(0, 10).map((p: any) => ({
            id: 'pdl_' + (p.id || Math.random()), empresa: p.job_company_name || 'Sin nombre',
            industria: p.industry || 'Sin clasificar',
            ciudad: p.location_locality || p.location_region || 'México',
            empleados: p.job_company_size || 'Sin datos',
            contacto: ((p.first_name || '') + ' ' + (p.last_name || '')).trim(),
            cargo: p.job_title || 'Sin cargo',
            email: limpiarEmail(p.work_email || p.personal_emails?.[0]),
            emailOculto: true,
            emailFuente: limpiarEmail(p.work_email || p.personal_emails?.[0]) ? 'PDL' : null,
            telefono: p.mobile_phone || null, telefonoOculto: true,
            telefonoFuente: p.mobile_phone ? 'PDL' : null,
            linkedin: p.linkedin_url || null, score: p.work_email ? 85 : 55, fuente: 'PDL',
          }))
          fuentesUsadas['PDL'] = { resultados: pdlResults.length, status: 'ok' }
        }
      }
    } catch { fuentesUsadas['PDL'] = { resultados: 0, status: 'error' } }

    const personaMap = new Map()
    const allResults = [...googleResults, ...apolloResults, ...denueResults, ...rrResults, ...pdlResults]
    for (const r of allResults) {
      const empresaKey = (r.empresa || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const contactoKey = (r.contacto || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const key = contactoKey && contactoKey !== 'sindatos' ? empresaKey + '_' + contactoKey : empresaKey + '_' + r.id
      if (!personaMap.has(key)) {
        personaMap.set(key, r)
      } else {
        const existing = personaMap.get(key)
        const existingScore = (existing.email ? 40 : 0) + (existing.telefono ? 30 : 0) + (existing.linkedin ? 20 : 0) + existing.score
        const newScore = (r.email ? 40 : 0) + (r.telefono ? 30 : 0) + (r.linkedin ? 20 : 0) + r.score
        if (newScore > existingScore) {
          personaMap.set(key, { ...existing, ...r, email: r.email || existing.email, emailFuente: r.emailFuente || existing.emailFuente, telefono: r.telefono || existing.telefono, telefonoFuente: r.telefonoFuente || existing.telefonoFuente, linkedin: r.linkedin || existing.linkedin })
        } else {
          personaMap.set(key, { ...r, ...existing, email: existing.email || r.email, emailFuente: existing.emailFuente || r.emailFuente, telefono: existing.telefono || r.telefono, telefonoFuente: existing.telefonoFuente || r.telefonoFuente, linkedin: existing.linkedin || r.linkedin })
        }
      }
    }
    const resultados = Array.from(personaMap.values()).sort((a, b) => b.score - a.score)
    if (resultados.length === 0) {
      return NextResponse.json({ error: 'No se encontraron resultados.', fuentes: fuentesUsadas })
    }

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const completos = resultados.filter((r: any) => r.email && r.telefono && r.empresa !== 'Sin nombre')
      if (completos.length > 0) {
        await Promise.all(completos.map(async (r: any) => {
          await supabase.from('prospectos_verificados').upsert({
            empresa: r.empresa, industria: r.industria, ciudad: r.ciudad, empleados: r.empleados,
            contacto: r.contacto, cargo: r.cargo, email: r.email, telefono: r.telefono,
            linkedin: r.linkedin, fuente: r.fuente, score: r.score, updated_at: new Date().toISOString(),
          }, { onConflict: 'email,empresa', ignoreDuplicates: false })
        }))
      }
    } catch {}

    return NextResponse.json({ resultados, total: resultados.length, fuentes: fuentesUsadas })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno', fuentes: fuentesUsadas }, { status: 500 })
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
