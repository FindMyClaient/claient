import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { telefono, codigo, empresa_id, tipo } = await req.json()
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceSid = process.env.TWILIO_VERIFY_SID
    
    const res = await fetch('https://verify.twilio.com/v2/Services/' + serviceSid + '/VerificationCheck', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: telefono, Code: codigo }).toString(),
    })
    
    const data = await res.json()
    if (!res.ok || data.status !== 'approved') {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 })
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    if (empresa_id) {
      await supabase.from('empresas_registro').update({ telefono_verificado: true }).eq('id', empresa_id)
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}