'use client'
import { useState } from 'react'
import { Check, Zap, Building2, ArrowRight, X, CreditCard, Shield, Clock } from 'lucide-react'

type Periodo = 'mensual' | 'semestral' | 'anual'

const planes = {
  pro: {
    nombre: 'Pro',
    descripcion: 'Para vendedores individuales',
    usuarios: 1,
    creditos: 1000,
    color: '#0cc0df',
    features: [
      '100 búsquedas al mes',
      'Exportaciones ilimitadas',
      'Todos los filtros disponibles',
      'Búsqueda por geolocalización',
      'Búsquedas guardadas',
      '1,000 créditos mensuales',
      'Email y teléfono por crédito',
      'Soporte en español',
    ],
    precios: {
      mensual: { precio: 999, duracion: '30 días', ahorro: null },
      semestral: { precio: 4999, duracion: '6 meses', ahorro: 'Ahorras $995 MXN' },
      anual: { precio: 9000, duracion: '12 meses', ahorro: 'Ahorras $2,988 MXN' },
    },
  },
  business: {
    nombre: 'Business',
    descripcion: 'Para equipos de ventas',
    usuarios: 5,
    creditos: 6000,
    color: '#0cc0df',
    features: [
      '600 búsquedas al mes',
      'Exportaciones ilimitadas',
      'Todos los filtros disponibles',
      'Búsqueda por geolocalización',
      'Búsquedas guardadas',
      '6,000 créditos mensuales acumulables',
      '5 usuarios incluidos (1 admin)',
      'Panel de administrador completo',
      'Reportes semanales de uso',
      'Distribución de créditos por usuario',
      'Usuario extra: +$500 MXN/mes',
    ],
    precios: {
      mensual: { precio: 4999, duracion: '30 días', ahorro: null },
      semestral: { precio: 25000, duracion: '6 meses', ahorro: 'Ahorras $4,994 MXN' },
      anual: { precio: 45000, duracion: '12 meses', ahorro: 'Ahorras $14,988 MXN' },
    },
  },
}

const periodoLabels: Record<Periodo, string> = {
  mensual: 'Mensual',
  semestral: '6 meses',
  anual: 'Anual',
}

const periodoDesc: Record<Periodo, string> = {
  mensual: 'Créditos se reinician cada 30 días',
  semestral: 'Créditos acumulables · cobro único',
  anual: 'Créditos acumulables · mejor precio',
}

export default function Planes() {
  const [periodo, setPeriodo] = useState<Periodo>('mensual')
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)

  const handleSeleccionar = (plan: string) => {
    setPlanSeleccionado(plan)
    setMostrarModal(true)
  }

  const precioMensual = (plan: typeof planes.pro, p: Periodo) => {
    const precio = plan.precios[p].precio
    if (p === 'mensual') return precio
    if (p === 'semestral') return Math.round(precio / 6)
    return Math.round(precio / 12)
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/1.svg" alt="CLAIENT" className="h-35 w-auto" />
            <span className="text-xs text-[#0cc0df] border border-[#0cc0df]/30 rounded-full px-2 py-0.5">B2B Search</span>
          </div>
          <a href="/" className="text-xs text-white/40 hover:text-white transition">← Volver al buscador</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Elige tu plan</h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">Sin sorpresas. Sin letra pequeña. Paga en pesos mexicanos con factura CFDI.</p>
        </div>

        {/* Selector de periodo */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex gap-1 bg-[#0d0d0d] border border-white/5 rounded-xl p-1 mb-3">
            {(['mensual', 'semestral', 'anual'] as Periodo[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition relative ${periodo === p ? 'bg-[#0cc0df] text-black' : 'text-white/40 hover:text-white'}`}
              >
                {periodoLabels[p]}
                {p === 'anual' && <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full text-[10px]">-25%</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/30">{periodoDesc[periodo]}</p>
        </div>

        {/* Tarjetas de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Plan Free */}
          <div className="md:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-white">Free</span>
                  <span className="text-xs bg-white/10 text-white/50 rounded-full px-2 py-0.5">Para probar</span>
                </div>
                <p className="text-sm text-white/40">5 búsquedas · 10 créditos · requiere tarjeta</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0cc0df]" />5 búsquedas</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0cc0df]" />10 créditos</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0cc0df]" />Sin permanencia</span>
                </div>
                <button
                  onClick={() => handleSeleccionar('free')}
                  className="flex items-center gap-2 border border-white/15 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:border-[#0cc0df]/40 hover:text-[#0cc0df] transition"
                >
                  Empezar gratis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Plan Pro */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8 hover:border-[#0cc0df]/30 transition">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-[#0cc0df]" />
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Pro</span>
            </div>
            <p className="text-sm text-white/40 mb-6">{planes.pro.descripcion}</p>

            <div className="mb-2">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-white">${precioMensual(planes.pro, periodo).toLocaleString()}</span>
                <span className="text-white/40 mb-2 text-sm">MXN/mes</span>
              </div>
              {periodo !== 'mensual' && (
                <div className="mt-1">
                  <span className="text-sm text-white/40">Cobro único de </span>
                  <span className="text-sm font-semibold text-white">${planes.pro.precios[periodo].precio.toLocaleString()} MXN</span>
                  <span className="text-sm text-white/40"> · {planes.pro.precios[periodo].duracion}</span>
                </div>
              )}
              {planes.pro.precios[periodo].ahorro && (
                <span className="inline-block mt-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                  {planes.pro.precios[periodo].ahorro}
                </span>
              )}
            </div>

            <div className="my-6 h-px bg-white/5" />

            <ul className="space-y-3 mb-8">
              {planes.pro.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                  <Check className="w-4 h-4 text-[#0cc0df] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSeleccionar('pro')}
              className="w-full bg-[#0cc0df] text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition text-sm tracking-wide uppercase"
            >
              Contratar Pro
            </button>
          </div>

          {/* Plan Business */}
          <div className="bg-[#0d0d0d] border border-[#0cc0df]/40 rounded-2xl p-8 relative shadow-[0_0_60px_rgba(12,192,223,0.08)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0cc0df] text-black text-xs font-bold px-4 py-1 rounded-full">
              MÁS POPULAR
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-[#0cc0df]" />
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Business</span>
            </div>
            <p className="text-sm text-white/40 mb-6">{planes.business.descripcion}</p>

            <div className="mb-2">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-white">${precioMensual(planes.business, periodo).toLocaleString()}</span>
                <span className="text-white/40 mb-2 text-sm">MXN/mes</span>
              </div>
              {periodo !== 'mensual' && (
                <div className="mt-1">
                  <span className="text-sm text-white/40">Cobro único de </span>
                  <span className="text-sm font-semibold text-white">${planes.business.precios[periodo].precio.toLocaleString()} MXN</span>
                  <span className="text-sm text-white/40"> · {planes.business.precios[periodo].duracion}</span>
                </div>
              )}
              {planes.business.precios[periodo].ahorro && (
                <span className="inline-block mt-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                  {planes.business.precios[periodo].ahorro}
                </span>
              )}
            </div>

            <div className="my-6 h-px bg-white/5" />

            <ul className="space-y-3 mb-8">
              {planes.business.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                  <Check className="w-4 h-4 text-[#0cc0df] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSeleccionar('business')}
              className="w-full bg-[#0cc0df] text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition text-sm tracking-wide uppercase"
            >
              Contratar Business
            </button>
          </div>
        </div>

        {/* Comparativa de créditos */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-sm mb-5 text-white/60 uppercase tracking-wider">Comportamiento de créditos por periodo</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['mensual', 'semestral', 'anual'] as Periodo[]).map(p => (
              <div key={p} className={`rounded-xl p-4 border ${periodo === p ? 'border-[#0cc0df]/40 bg-[#0cc0df]/5' : 'border-white/5 bg-[#141414]'}`}>
                <div className="font-semibold text-sm text-white mb-3">{periodoLabels[p]}</div>
                <div className="space-y-2 text-xs text-white/50">
                  {p === 'mensual' ? (
                    <>
                      <div className="flex items-start gap-1.5"><X className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />Créditos NO acumulables</div>
                      <div className="flex items-start gap-1.5"><Check className="w-3 h-3 text-[#0cc0df] flex-shrink-0 mt-0.5" />Se reinician al día 31</div>
                      <div className="flex items-start gap-1.5"><Check className="w-3 h-3 text-[#0cc0df] flex-shrink-0 mt-0.5" />Mayor flexibilidad</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />Créditos acumulables</div>
                      <div className="flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />Se suman cada 30 días</div>
                      <div className="flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />Renueva antes de vencer para conservarlos</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garantías */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'Factura CFDI incluida', desc: 'Deducible de impuestos en México' },
            { icon: CreditCard, title: 'Pago seguro', desc: 'Procesado por Stripe con cifrado SSL' },
            { icon: Clock, title: 'Sin contratos', desc: 'Cancela o cambia de plan cuando quieras' },
          ].map(g => (
            <div key={g.title} className="flex items-start gap-3 bg-[#0d0d0d] border border-white/5 rounded-xl p-4">
              <g.icon className="w-5 h-5 text-[#0cc0df] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">{g.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal de pago */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button onClick={() => setMostrarModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>

            {planSeleccionado === 'free' ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-[#0cc0df]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-[#0cc0df]" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Comenzar con Free</h2>
                  <p className="text-white/40 text-sm">Incluye 5 búsquedas y 10 créditos para que conozcas la plataforma</p>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-xl p-4 mb-6">
                  <p className="text-xs text-white/50 mb-3">¿Por qué pedimos tu tarjeta?</p>
                  <p className="text-sm text-white/60 leading-relaxed">Para evitar cuentas duplicadas y garantizar la calidad de nuestra base de datos. <span className="text-white">No se realizará ningún cargo</span> hasta que elijas un plan de pago.</p>
                </div>
                <button className="w-full bg-[#0cc0df] text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition text-sm uppercase tracking-wide">
                  Registrar tarjeta y comenzar
                </button>
                <p className="text-xs text-white/25 text-center mt-3">Al terminar tus 5 búsquedas verás las opciones de planes</p>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-[#0cc0df]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {planSeleccionado === 'pro' ? <Zap className="w-7 h-7 text-[#0cc0df]" /> : <Building2 className="w-7 h-7 text-[#0cc0df]" />}
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    Plan {planSeleccionado === 'pro' ? 'Pro' : 'Business'} · {periodoLabels[periodo]}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {planSeleccionado === 'pro'
                      ? `$${planes.pro.precios[periodo].precio.toLocaleString()} MXN · ${planes.pro.precios[periodo].duracion}`
                      : `$${planes.business.precios[periodo].precio.toLocaleString()} MXN · ${planes.business.precios[periodo].duracion}`}
                  </p>
                </div>

                {/* Resumen */}
                <div className="bg-[#141414] border border-white/5 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Plan</span>
                    <span className="text-white">{planSeleccionado === 'pro' ? 'Pro' : 'Business'} · {periodoLabels[periodo]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Créditos incluidos</span>
                    <span className="text-white">{planSeleccionado === 'pro' ? '1,000' : '6,000'}/mes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Créditos acumulables</span>
                    <span className={periodo === 'mensual' ? 'text-red-400' : 'text-emerald-400'}>{periodo === 'mensual' ? 'No' : 'Sí'}</span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-[#0cc0df]">
                      ${(planSeleccionado === 'pro' ? planes.pro.precios[periodo].precio : planes.business.precios[periodo].precio).toLocaleString()} MXN + IVA
                    </span>
                  </div>
                </div>

                <button className="w-full bg-[#0cc0df] text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Proceder al pago
                </button>
                <p className="text-xs text-white/25 text-center mt-3">Pago seguro vía Stripe · Factura CFDI incluida</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}