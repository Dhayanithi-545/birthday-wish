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
  const location = [city, region, country].filter(Boolean).join(', ') || 'Unknown'

  const forwarded = req.headers['x-forwarded-for']
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
    req.headers['x-real-ip'] ||
    'Unknown'

  const payload = {
    ...data,
    location,
    ip,
    ua: req.headers['user-agent'] || data.ua || ''
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(502).json({ error: 'Failed to forward to Google Sheet' })
  }
}
