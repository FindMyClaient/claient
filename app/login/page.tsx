'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const loginGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const loginEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/1.svg" alt="CLAIENT" style={{height:'150px', margin:'0 auto 24px'}} />
          <h1 className="text-white text-xl font-semibold mb-1">Bienvenido de vuelta</h1>
          <p className="text-white/40 text-sm">Inicia sesión para continuar</p>
        </div>
        <div className="bg-[#0f1011] border border-white/8 rounded-xl p-6">
          {!sent ? (
            <>
              <button
                onClick={loginGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition text-sm mb-4 disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/8"></div>
                <span className="text-white/25 text-xs">o con email</span>
                <div className="flex-1 h-px bg-white/8"></div>
              </div>
              <form onSubmit={loginEmail}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#08090a] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#0cc0df]/50 mb-3"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#0cc0df] text-black font-medium py-2.5 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
                </button>
              </form>
              {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[#0cc0df]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#0cc0df]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-white font-medium mb-2">Revisa tu email</h3>
              <p className="text-white/40 text-sm">Enviamos un enlace de acceso a <span className="text-white">{email}</span></p>
              <button onClick={() => setSent(false)} className="text-[#0cc0df] text-xs mt-4 hover:underline">
                Usar otro email
              </button>
            </div>
          )}
        </div>
        <p className="text-center text-white/25 text-xs mt-6">
          ¿No tienes cuenta?{' '}
          <a href="/planes" className="text-[#0cc0df] hover:underline">Ver planes</a>
        </p>
      </div>
    </div>
  )
}