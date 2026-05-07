export default function Mantenimiento() {
  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <img src="/1.svg" alt="CLAIENT" style={{height:'120px', margin:'0 auto 40px'}} />
        
        <div className="w-16 h-16 bg-[#0cc0df]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#0cc0df]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>

        <h1 className="text-white text-3xl font-bold mb-4">Estamos mejorando CLAIENT</h1>
        
        <p className="text-white/60 text-base mb-8 leading-relaxed">
          Estamos trabajando para ofrecerte la base de datos B2B más completa y verificada de México.
          <br /><br />
          Volveremos pronto con una experiencia mucho mejor.
        </p>

        <div className="bg-[#0f1011] border border-white/8 rounded-xl p-6 mb-6">
          <p className="text-white/40 text-sm mb-3">¿Quieres ser de los primeros en saber cuando regresemos?</p>
          <a 
            href="mailto:contacto@findmyclaient.com?subject=Quiero ser notificado del relanzamiento"
            className="inline-block bg-[#0cc0df] text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition"
          >
            Avísame del relanzamiento
          </a>
        </div>

        <p className="text-white/30 text-xs">
          contacto@findmyclaient.com · México
        </p>
      </div>
    </div>
  )
}
