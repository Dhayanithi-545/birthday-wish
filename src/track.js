const ENDPOINT = '/api/track'

const SECTIONS = [
  ['.descwrap', '2/8 · Diving Down'],
  ['#school', '3/8 · School Days'],
  ['#grow', '4/8 · Growing Up'],
  ['#recent', '5/8 · Recent Memories'],
  ['#izo', '6/8 · Izo (Cat)'],
  ['#surf', '7/8 · Birthday Cake'],
  ['#end', '8/8 · Final Gift']
]

const getDevice = () => {
  const ua = navigator.userAgent || ''
  const kind = /iPhone/i.test(ua) ? 'iPhone'
    : /iPad/i.test(ua) ? 'iPad'
    : /Android/i.test(ua) ? (/Mobile/i.test(ua) ? 'Android Phone' : 'Android Tablet')
    : /Mobi/i.test(ua) ? 'Mobile'
    : 'Desktop'
  const os = /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
    : /Android/i.test(ua) ? 'Android'
    : /Windows/i.test(ua) ? 'Windows'
    : /Mac OS/i.test(ua) ? 'macOS'
    : /Linux/i.test(ua) ? 'Linux'
    : 'Other OS'
  const browser = /WhatsApp/i.test(ua) ? 'WhatsApp'
    : /Instagram/i.test(ua) ? 'Instagram'
    : /FBAN|FBAV/i.test(ua) ? 'Facebook'
    : /Edg/i.test(ua) ? 'Edge'
    : /Chrome|CriOS/i.test(ua) ? 'Chrome'
    : /Firefox|FxiOS/i.test(ua) ? 'Firefox'
    : /Safari/i.test(ua) ? 'Safari'
    : 'Browser'
  return `${kind} (${os} · ${browser})`
}

const ordinal = n => {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  if (n % 10 === 1) return `${n}st`
  if (n % 10 === 2) return `${n}nd`
  if (n % 10 === 3) return `${n}rd`
  return `${n}th`
}

const getVisitor = () => {
  try {
    const raw = localStorage.getItem('bw_visitor')
    const parsed = raw ? JSON.parse(raw) : null
    const id = parsed?.id || Math.random().toString(36).slice(2, 8)
    const count = (parsed?.count || 0) + 1
    localStorage.setItem('bw_visitor', JSON.stringify({ id, count }))
    return `${ordinal(count)} visit`
  } catch {
    return 'Visit'
  }
}

const getSource = () => {
  const params = new URLSearchParams(location.search)
  const tag = params.get('from') || params.get('ref') || params.get('for')
  let ref = ''
  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '')
      if (/instagram/i.test(host)) ref = 'From Instagram'
      else if (/whatsapp/i.test(host)) ref = 'From WhatsApp'
      else if (/facebook/i.test(host)) ref = 'From Facebook'
      else if (/t\.co|twitter|x\.com/i.test(host)) ref = 'From X / Twitter'
      else ref = `From ${host}`
    } catch {
      ref = `From ${document.referrer}`
    }
  } else {
    ref = 'Opened directly'
  }
  return tag ? `${ref} (${tag})` : ref
}

const formatDuration = ms => {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 5) return 'Just opened'
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

const startedAt = Date.now()
const visitId = `${startedAt.toString(36)}-${Math.random().toString(36).slice(2, 6)}`

let bubbleCount = 0
let candleMethod = ''
let bottleOpened = false
let wrongCodeCount = 0
let codeUnlocked = false
let meetChoice = ''
let tappedAge = false
let deepestIdx = -1
let timer = null

const state = {
  visitId,
  timeSpent: 'Just opened',
  device: getDevice(),
  visitor: getVisitor(),
  openedFrom: getSource(),
  diveStatus: 'Still on Cover',
  section: '1/8 · Cover Page',
  bubbles: 'None yet',
  endingStatus: 'Not yet'
}

const updateEnding = () => {
  const parts = []
  if (candleMethod) parts.push(`Blew candles (${candleMethod})`)
  if (codeUnlocked) parts.push('Unlocked note (devols-545)')
  else if (bottleOpened) {
    parts.push(wrongCodeCount > 0 ? `Bottle locked (${wrongCodeCount} wrong code)` : 'Opened bottle (Code locked)')
  }
  if (meetChoice) parts.push(`Meet: ${meetChoice}`)
  if (tappedAge) parts.push('Tapped 20yrs!')
  state.endingStatus = parts.length ? parts.join(' · ') : 'Not yet'
}

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
          state.section = SECTIONS[idx][1]
          schedule()
        }
      })
    }, { threshold: 0.2 })

    SECTIONS.forEach(([sel], idx) => {
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
    if (state.diveStatus !== 'Clicked Dive') {
      state.diveStatus = 'Clicked Dive'
      schedule()
    }
  },
  bubble() {
    bubbleCount += 1
    state.bubbles = bubbleCount === 1 ? '1 bubble' : `${bubbleCount} bubbles`
    schedule()
  },
  candles(method = 'Hold') {
    candleMethod = method
    updateEnding()
    send(false)
  },
  bottle() {
    if (!bottleOpened) {
      bottleOpened = true
      updateEnding()
      send(false)
    }
  },
  wrongCode() {
    wrongCodeCount += 1
    updateEnding()
    schedule()
  },
  unlock(silent = false) {
    if (!codeUnlocked) {
      codeUnlocked = true
      updateEnding()
      if (!silent) send(false)
    }
  },
  meet(choice) {
    meetChoice = meetChoice && !meetChoice.includes(choice) ? `${meetChoice} → ${choice}` : choice
    updateEnding()
    send(true)
  },
  ageTap() {
    if (!tappedAge) {
      tappedAge = true
      updateEnding()
      schedule()
    }
  }
}
