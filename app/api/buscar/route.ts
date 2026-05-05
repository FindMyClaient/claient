import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { busqueda, industria, departamento, headcount, estado, seniority, keywords } = body

    const payload: Record<string, any> = {
      page: 1,
      per_page: 25,
      person_locations: estado && estado !== 'Todo México' ? [`${estado}, Mexico`] : ['Mexico'],
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

    const response = await fetch('https://api.apollo.io/v1/mixed_people/api_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.APOLLO_API_KEY || '',
      },
      body: JSON.stringify(payload),
    })

    const text = await response.text()

    if (!response.ok) {
      console.error('Apollo error:', response.status, text)
      return NextResponse.json({ error: `Apollo error ${response.status}: ${text}` }, { status: 500 })
    }

    const data = JSON.parse(text)
    const people = data.people || []

    const resultados = people.map((p: any) => ({
      id: p.id || Math.random().toString(),
      empresa: p.organization?.name || 'Sin nombre',
      industria: p.organization?.industry || 'Sin clasificar',
      ciudad: p.city || p.state || 'México',
      empleados: formatEmpleados(p.organization?.estimated_num_employees),
      contacto: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Sin nombre',
      cargo: p.title || 'Sin cargo',
      email: p.email || null,
      emailOculto: true,
      telefono: p.phone_numbers?.[0]?.sanitized_number || null,
      telefonoOculto: true,
      linkedin: p.linkedin_url || null,
      score: calcScore(p),
    }))

    return NextResponse.json({ resultados, total: data.pagination?.total_entries || resultados.length })

  } catch (err: any) {
    console.error('Error interno:', err)
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
  }
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
