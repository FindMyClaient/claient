'use client'
import { useRouter } from 'next/navigation'

export default function Landing() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col">
      <nav className="border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/1.svg" alt="CLAIENT" className="h-24 w-auto" />
          <div className="flex items-center gap-8 text-sm text-white/50">
            <a href="#producto" className="hover:text-white transition">Producto</a>
            <a href="#como-funciona" className="hover:text-white transition">Cómo funciona</a>
            <a href="/planes" className="hover:text-white transition">Precios</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/login')} className="text-sm text-white/60 hover:text-white transition px-4 py-2">Iniciar sesión</button>
            <button onClick={() => router.push('/login')} className="bg-[#0cc0df] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition">Comenzar →</button>
          </div>
        </div>
      </nav>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="inline-flex items-center gap-2 bg-[#0cc0df]/10 border border-[#0cc0df]/20 rounded-full px-4 py-1.5 text-xs text-[#0cc0df] mb-8">
          <span className="w-1.5 h-1.5 bg-[#0cc0df] rounded-full animate-pulse"></span>
          B2B Customer Acquisition · México & LATAM
        </div>
        <h1 className="text-6xl font-bold leading-tight mb-6 max-w-4xl">La forma más inteligente<br />de encontrar <span className="text-[#0cc0df]">clientes B2B</span></h1>
        <p className="text-white/40 text-xl max-w-2xl mb-12">Busca empresas y contactos clave en México y LATAM. Datos verificados de múltiples fuentes, scoring con IA y exportación instantánea.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/login')} className="bg-[#0cc0df] text-black font-bold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition">Comenzar ahora</button>
          <a href="#producto" className="text-white/50 hover:text-white transition text-sm">Ver el producto →</a>
        </div>
      </section>
      <section id="producto" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Todo lo que necesitas para prospectar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{icon:'🎯',title:'Búsqueda inteligente',desc:'Filtra por industria, tamaño, ubicación, cargo y más de 15 criterios.'},{icon:'📍',title:'Búsqueda por radio',desc:'Encuentra empresas cerca de cualquier dirección con Google Maps integrado.'},{icon:'✉️',title:'Emails verificados',desc:'Accede a emails y teléfonos verificados con un solo clic.'},{icon:'🤖',title:'Scoring con IA',desc:'Cada prospecto recibe un score de relevancia basado en tus criterios.'},{icon:'📊',title:'Exportación CSV',desc:'Exporta tus prospectos al CRM o herramienta que uses.'},{icon:'🔔',title:'Alertas automáticas',desc:'Guarda búsquedas y recibe alertas cuando hay nuevos prospectos.'}].map((f,i)=>(
              <div key={i} className="bg-[#0d0d0d] border border-white/5 rounded-xl p-6 hover:border-[#0cc0df]/20 transition">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 text-center border-t border-white/5">
        <h2 className="text-4xl font-bold mb-4">Empieza hoy gratis</h2>
        <p className="text-white/40 mb-8">Sin tarjeta de crédito. 100 búsquedas gratuitas.</p>
        <button onClick={() => router.push('/login')} className="bg-[#0cc0df] text-black font-bold text-lg px-10 py-4 rounded-xl hover:opacity-90 transition">Crear cuenta gratis</button>
      </section>
      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/20 text-sm">
        © 2026 Claient · <a href="/privacidad" className="hover:text-white/40 transition">Privacidad</a> · <a href="/terminos" className="hover:text-white/40 transition">Términos</a>
      </footer>
    </div>
  )
}
