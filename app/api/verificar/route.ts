import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { telefono } = await req.json()
    if (!telefono) return NextResponse.json({ error: 'Teléfono requerido' }, { status: 400 })
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceSid = process.env.TWILIO_VERIFY_SID
    
    const res = await fetch('https://verify.twilio.com/v2/Services/' + serviceSid + '/Verifications', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: telefono, Channel: 'sms' }).toString(),
    })
    
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}