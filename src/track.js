const ENDPOINT = '/api/track'

const SECTIONS = [
  ['.descwrap', 'Descent'],
  ['#school', 'School'],
  ['#grow', 'Growing'],
  ['#recent', 'Recent'],
  ['#izo', 'Izo'],
  ['#surf', 'Surface'],
  ['#end', 'End']
]

const getDevice = () => {
  const ua = navigator.userAgent || ''
  const type = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobi|Android|iPhone|iPod/i.test(ua) ? 'Mobile' : 'Desktop'
  const os = /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : /Windows/i.test(ua) ? 'Windows' : /Mac OS/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Other OS'
  const browser = /WhatsApp/i.test(ua) ? 'WhatsApp' : /Instagram/i.test(ua) ? 'Instagram' : /Edg/i.test(ua) ? 'Edge' : /Chrome|CriOS/i.test(ua) ? 'Chrome' : /Firefox|FxiOS/i.test(ua) ? 'Firefox' : /Safari/i.test(ua) ? 'Safari' : 'Browser'
  return `${type} · ${os} · ${browser} (${screen.width}x${screen.height})`
}

const getVisitor = () => {
  try {
    const raw = localStorage.getItem('bw_visitor')
    const parsed = raw ? JSON.parse(raw) : null
    const id = parsed?.id || Math.random().toString(36).slice(2, 8)
    const count = (parsed?.count || 0) + 1
    localStorage.setItem('bw_visitor', JSON.stringify({ id, count }))
    return `${count === 1 ? 'New' : 'Repeat'} (#${count}, ${id})`
  } catch {
    return 'Unknown'
  }
}

const getSource = () => {
  const params = new URLSearchParams(location.search)
  const tag = params.get('from') || params.get('ref') || params.get('for')
  let ref = 'Direct'
  if (document.referrer) {
    try { ref = new URL(document.referrer).hostname } catch { ref = document.referrer }
  }
  return tag ? `${ref} (${tag})` : ref
}

const formatDuration = ms => {
  const s = Math.max(0, Math.round(ms / 1000))
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

const startedAt = Date.now()
const visitId = `${startedAt.toString(36)}-${Math.random().toString(36).slice(2, 6)}`

const state = {
  visitId,
  visitor: getVisitor(),
  device: getDevice(),
  env: `${innerWidth > innerHeight ? 'landscape' : 'portrait'} · ${navigator.connection?.effectiveType || 'unknown net'}`,
  tz: `${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'} (${new Date().toLocaleTimeString()})`,
  source: getSource(),
  timeSpent: '0s',
  clickedDive: 'No',
  deepestSection: 'Landing',
  bubblesPopped: 0,
  blewCandles: 'No',
  openedBottle: 'No'
}

let deepestIdx = -1
let timer = null

const send = (useBeacon = false) => {
  state.timeSpent = formatDuration(Date.now() - startedAt)
  const body = JSON.stringify(state)
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
    return
  }
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body
  }).catch(() => {})
}

const schedule = () => {
  clearTimeout(timer)
  timer = setTimeout(() => send(false), 800)
}

export const track = {
  init() {
    send(false)

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const idx = Number(entry.target.dataset.trackIdx)
        if (idx > deepestIdx) {
          deepestIdx = idx
          state.deepestSection = SECTIONS[idx][1]
          schedule()
        }
      })
    }, { threshold: 0.2 })

    SECTIONS.forEach(([sel, _], idx) => {
      const el = document.querySelector(sel)
      if (el) {
        el.dataset.trackIdx = String(idx)
        io.observe(el)
      }
    })

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) send(true)
    })
    addEventListener('pagehide', () => send(true))
  },
  dive() {
    if (state.clickedDive !== 'Yes') {
      state.clickedDive = 'Yes'
      schedule()
    }
  },
  bubble() {
    state.bubblesPopped += 1
    schedule()
  },
  candles(method = 'Hold') {
    state.blewCandles = `Yes (${method})`
    send(false)
  },
  bottle() {
    if (state.openedBottle !== 'Yes') {
      state.openedBottle = 'Yes'
      send(false)
    }
  }
}
