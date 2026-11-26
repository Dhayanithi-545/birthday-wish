const APPS_SCRIPT_URL =
  process.env.GSHEET_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbw2TBh0Mm04lW0ji_93Cg5BAsH9lPDRWNQ2fQHOD3YWh_6piJf206gAG_r8mmz-ctZUPA/exec'

const safeDecode = v => {
  if (!v) return ''
  try { return decodeURIComponent(v) } catch { return v }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let data = {}
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const city = safeDecode(req.headers['x-vercel-ip-city'])
  const region = safeDecode(req.headers['x-vercel-ip-country-region'])
  const country = safeDecode(req.headers['x-vercel-ip-country'])
  const location = [city, region, country].filter(Boolean).join(', ') || 'Unknown location'

  const payload = { ...data, location }

  try {
    const r = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    })
    return res.status(200).json({ ok: r.ok })
  } catch {
    return res.status(502).json({ error: 'Failed to forward to Google Sheet' })
  }
}
