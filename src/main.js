import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FallingLeaves } from 'falling-leaves'
import confetti from 'canvas-confetti'
import { Fireworks } from 'fireworks-js'
import 'sakura-js/dist/sakura.min.css'
import sakuraRaw from 'sakura-js/dist/sakura.js?raw'
import { C } from './captions.js'
import { sea, DUSK, DAWN } from './sea.js'
import { track } from './track.js'
gsap.registerPlugin(ScrollTrigger)
const U = import.meta.glob('./assets/**/*.{webp,svg,mp3,mp4}', { eager: true, query: '?url', import: 'default' })
const A = p => U['./assets/' + p]
const $ = s => document.querySelector(s)
const low = (navigator.hardwareConcurrency || 8) <= 4
const h = C.hero, s = C.school, g = C.grow, r = C.recent, z = C.izo, f = C.surface, e = C.end
const pol = (k, src, cap, cls = '') => `<div class="pol ${cls}"><img src="${A(src)}" alt="" loading="lazy" decoding="async"><b>${cap}</b><img class="tp" src="${A('svg/ui/tape.svg')}" alt=""></div>`
const sticker = (src, w, side, b) => `<img class="stand" src="${A(src)}" style="width:${w}px;${side};bottom:${b}px" alt="" loading="lazy">`
$('#app').innerHTML = `
<section class="hero"><div class="txt"><small>${h.kicker}</small><h1>${h.l1}<br><span class="l2">${h.l2}</span></h1><p>${h.sub}</p></div>
 <img class="wave w1" src="${A('scenery/wave_back.webp')}" alt=""><div class="shipw"><img class="ship" src="${A('scenery/ship.webp')}" alt=""><img class="ship refl" src="${A('scenery/ship.webp')}" alt=""></div>
 <img class="wave w2" src="${A('scenery/wave_mid.webp')}" alt=""><img class="wave w3" src="${A('scenery/wave_front.webp')}" alt="">
 <button class="dive" id="dive">${h.btn}</button></section>
<section class="descwrap"><video id="jv" src="${A('dive_loop.mp4')}" muted loop playsinline preload="metadata"></video>${C.descent.map(t => `<div class="desc"><p class="rise">${t}</p></div>`).join('')}</section>
<section class="school" id="school"><h2>${s.title}</h2><p class="sub">${s.sub}</p>
 <div class="board"><img src="${A('svg/props/chalkboard.svg')}" alt=""><span>${s.title}</span></div>
 <div class="line"></div><div class="rig">${pol(0, 'photos/classroom_group.webp', s.cap.classroom_group)}${pol(1, 'photos/school_crop.webp', s.cap.school_crop)}${pol(2, 'photos/stairs_group.webp', s.cap.stairs_group, 'wide')}${pol(3, 'photos/bus_selfie.webp', s.cap.bus_selfie, 'wide')}${pol(4, 'photos/cinema_group.webp', s.cap.cinema_group, 'wide')}</div>
 <div class="sandrow"><img class="sm" src="${A('scenery/seabed_near.webp')}" alt="" loading="lazy"><img class="sf" src="${A('scenery/sand_floor.webp')}" alt="" loading="lazy">
  ${sticker('cutouts/trophy_day.webp', 112, 'left:1%', 60)}
  <img class="prop ring" style="width:70px;left:42%;bottom:50px" src="${A('svg/props/school_bell.svg')}" alt=""><img class="prop" style="width:90px;left:30%;bottom:34px" src="${A('svg/props/books_stack.svg')}" alt=""></div>
 ${s.bubbles.map((t, i) => `<button class="bub" data-t="${t}" style="left:${[18, 72, 44][i]}%;top:${[58, 48, 80][i]}%" aria-label="memory"></button>`).join('')}
 <img class="jelly" style="left:70%;top:20%" src="${A('svg/creatures/jelly_a.svg')}" alt="">
</section>
<div class="seam"><video class="vbird" data-v muted loop playsinline preload="metadata" poster="${A('bird_poster.webp')}" src="${A('bird_loop.mp4')}"></video></div>
<section class="grow" id="grow"><h2>${g.title}</h2><p class="sub">${g.sub}</p>
 <img class="prop swim" style="width:120px;top:16%" src="${A('svg/creatures/turtle_top.svg')}" alt=""><img class="prop swim s2" style="width:150px;top:30%" src="${A('svg/creatures/fish_school.svg')}" alt="">
 <div class="line"></div><div class="row">${['blurpink','friends_street','film_frame_1','film_frame_2','film_frame_3_crop','dog_friends'].map(k => pol(0, `photos/${k}.webp`, g.cap[k])).join('')}</div>
 <p class="hint">${g.hint}</p>
 <video class="vfish" data-v muted loop playsinline preload="metadata" src="${A('fish_loop.mp4')}"></video>
 <div class="floor"><img class="prop sway" style="width:150px;left:2%;bottom:0" src="${A('svg/plants/kelp_a.svg')}" alt="" loading="lazy"><img class="prop sway" style="width:130px;right:4%;bottom:0" src="${A('svg/plants/coral_fan.svg')}" alt="" loading="lazy">
  <img class="prop bob" style="width:110px;left:36%;bottom:0" src="${A('svg/creatures/octopus.svg')}" alt="" loading="lazy">
  <button class="bub" data-t="${g.bubbles[0]}" style="left:70%;top:10%" aria-label="memory"></button></div></section>
<section class="recent" id="recent"><img class="rays" src="${A('scenery/rays.webp')}" alt="" loading="lazy"><h2>${r.title}</h2><p class="sub">${r.sub}</p>
 <div class="rig2">${pol(0, 'photos/two_girls_lying.webp', r.cap.two_girls_lying)}</div>
 <div class="duo"><img src="${A('cutouts/mirror_white.webp')}" alt="" loading="lazy"></div>
 <div class="sandrow short"><img class="sf" src="${A('scenery/sand_floor.webp')}" alt="" loading="lazy">
  ${sticker('cutouts/sea_back.webp', 150, 'left:14%', 50)}${sticker('cutouts/saree_selfie.webp', 150, 'right:6%', 56)}
  <img class="prop spin" style="width:60px;left:50%;bottom:24px" src="${A('svg/creatures/starfish_a.svg')}" alt=""><p class="cap" style="position:absolute;left:12%;bottom:6px">${r.cap.sea_back}</p></div>
 <button class="bub" data-t="${r.bubbles[0]}" style="left:42%;top:46%" aria-label="memory"></button></section>
<section class="izo" id="izo"><video class="vizo" data-v muted loop playsinline preload="metadata" src="${A('jelly_loop.mp4')}"></video><div class="pol one"><img src="${A('photos/izo_cat_clean.webp')}" alt="" loading="lazy"><b>${z.title}</b></div>
 <img class="prop float" style="width:80px;left:12%;top:12%" src="${A('svg/props/lantern.svg')}" alt=""><img class="jelly" style="left:70%;top:60%" src="${A('svg/creatures/jelly_b.svg')}" alt="">
 <p class="izol">${z.line}</p><p class="izos">${z.small}</p></section>
<section class="surf" id="surf"><div class="sky"><h2 id="st">${f.title}</h2><p class="q">${f.quote}</p><p class="tg">${f.tanglish}</p><p class="ask" id="ask">${f.ask}</p></div>
 <div class="hang"><img class="prop bal" style="width:52%;left:24%;top:38svh;position:absolute" src="${A('svg/props/balloons.svg')}" alt="" loading="lazy">
 <div class="cake"><img src="${A('svg/props/cake_noflame.svg')}" alt=""><i class="fl" style="left:34%"></i><i class="fl" style="left:55%"></i></div></div>
 <button class="dive blow" id="blow">${f.btnHold}</button><button class="mic" id="mic">${f.btnMic}</button>
 <button class="bottle" id="bottle" aria-label="note"><img src="${A('svg/props/message_bottle.svg')}" alt=""><span>${f.bottleHint}</span></button>
 <img class="wave w2" src="${A('scenery/wave_mid.webp')}" alt=""><img class="wave w3" src="${A('scenery/wave_front.webp')}" alt=""></section>
<section class="end" id="end"><p>${e.l1}</p><p class="e2">${e.l2}</p><img class="gift" src="${A('svg/props/gift_box.svg')}" alt=""></section>
<canvas id="fx"></canvas><div class="modal" id="modal"><div class="paper">${C.note.lines.map(t => `<p>${t}</p>`).join('')}<p class="sign">${C.note.sign}</p><button id="close">close</button></div></div>
<div class="note" id="note"></div>`

// audio
const amb = new Audio(A('audio/ambience_loop.mp3')); amb.loop = true; amb.volume = .5
const splash = new Audio(A('audio/dive_splash.mp3'))
const pops = [1, 2, 3, 4].map(i => new Audio(A(`audio/bubble_pop_${i}.mp3`)))
$('#dive').onclick = () => {
  track.dive()
  splash.play().catch(() => {}); amb.play().catch(() => {})
  document.body.classList.remove('locked'); $('#hud').classList.add('on')

  window.scrollTo({ top: innerHeight, behavior: 'smooth' })
}
// bubbles: burst with non-maple leaves (ginkgo & petal) + mini-bubble sparkles at the bubble's exact position
const ginkgoLeaf = confetti.shapeFromPath({ path: 'M12 22 L12 14 C6 12 2 7 4 3 C7 4 10 5 12 7 C14 5 17 4 20 3 C22 7 18 12 12 14 Z' })
const petalLeaf = confetti.shapeFromPath({ path: 'M12 2 C17 6 19 13 12 21 C5 13 7 6 12 2 Z' })
document.querySelectorAll('.bub').forEach(b => b.onclick = () => {
  track.bubble()
  const rect = b.getBoundingClientRect()
  const origin = { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height / 2) / innerHeight }
  confetti({
    particleCount: low ? 18 : 28,
    spread: 115,
    startVelocity: 24,
    gravity: 0.6,
    ticks: 160,
    scalar: 1.35,
    origin,
    shapes: [ginkgoLeaf, petalLeaf],
    colors: ['#efc474', '#ec9a78', '#9ccfc4', '#f6efe0', '#ffb7c5'],
    disableForReducedMotion: true
  })
  confetti({
    particleCount: low ? 10 : 16,
    spread: 360,
    startVelocity: 16,
    gravity: 0.35,
    ticks: 80,
    scalar: 0.65,
    origin,
    shapes: ['circle'],
    colors: ['#9ccfc4', '#f6efe0', '#efc474'],
    disableForReducedMotion: true
  })
  b.classList.add('pop'); pops[Math.floor(Math.random() * 4)].cloneNode().play().catch(() => {}); navigator.vibrate?.(12)
  setTimeout(() => b.remove(), 300)
})
// scroll: reveals, water colour, age
gsap.utils.toArray('.rise').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 75%' } }))
const water = $('#water'), stops = [['#2a8a92', '#1d6370'], ['#1a6270', '#0f3f4d'], ['#0e3a48', '#071f2a'], ['#17525f', '#0d3440'], ['#2a7f88', '#185a67'], ['#0c2f3c', '#071f2a'], ['#4aa6a6', '#2b8a90'], ['#0a1d3a', '#050d1f']]
const mix = (a, b, t) => gsap.utils.interpolate(a, b, t)
ScrollTrigger.create({ trigger: '#app', start: 'top top', end: 'bottom bottom', onUpdate: self => {
  const p = self.progress * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(p)), t = p - i
  water.style.background = `linear-gradient(${mix(stops[i][0], stops[i + 1][0], t)},${mix(stops[i][1], stops[i + 1][1], t)})`
}})
document.addEventListener('visibilitychange', () => document.hidden ? amb.pause() : !document.body.classList.contains('locked') && amb.play().catch(() => {}))

// videos: play only while visible; skip on low power or reduced motion
const vids = [...document.querySelectorAll('video[data-v],#jv')]
if (low) document.body.classList.add('low')
if (low || matchMedia('(prefers-reduced-motion: reduce)').matches) vids.forEach(v => v.classList.contains('vbird') ? v.removeAttribute('src') : v.remove())
else { const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold: .05 }); vids.forEach(v => { if (v.classList.contains('vizo')) v.playbackRate = .6; io.observe(v) }) }

// age + audio by scene
const vol = { v: .5 }, setVol = v => gsap.to(vol, { v, duration: 1.5, onUpdate: () => amb.volume = vol.v })
ScrollTrigger.create({ trigger: '#izo', start: 'top 60%', end: 'bottom 40%', onToggle: t => setVol(t.isActive ? .2 : .5) })
// confetti
const cv = $('#fx'), cx = cv.getContext('2d'); let bits = [], raf
const cols = ['#d9694f', '#ec9a78', '#efc474', '#9ccfc4', '#f6efe0', '#2b8a90']
const burst = () => { cv.width = innerWidth; cv.height = innerHeight
  bits = Array.from({ length: low ? 60 : 130 }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 12, vy: -Math.random() * 14 - 4, w: 6 + Math.random() * 6, a: Math.random() * 6, c: cols[Math.floor(Math.random() * 6)] }))
  cancelAnimationFrame(raf); const tick = () => { cx.clearRect(0, 0, cv.width, cv.height); bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .35; b.vx *= .99; b.a += .15; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.a); cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.w / 4, b.w, b.w / 2); cx.restore() })
    bits = bits.filter(b => b.y < cv.height + 20); bits.length ? raf = requestAnimationFrame(tick) : cx.clearRect(0, 0, cv.width, cv.height) }; tick() }
// candles
const mb = new Audio(A('audio/musicbox_happy_birthday.mp3')), chime = new Audio(A('audio/chime_reveal.mp3')); let blown = false
const launchFireworks = () => {
  if (still) return
  const box = document.createElement('div')
  box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:47'
  document.body.appendChild(box)
  const fw = new Fireworks(box, {
    rocketsPoint: { min: 20, max: 80 },
    particles: low ? 45 : 75,
    explosion: 5,
    intensity: 28,
    traceLength: 3,
    opacity: 0.35,
    hue: { min: 0, max: 360 },
    delay: { min: 25, max: 50 }
  })
  fw.start()
  fw.launch(4)
  setTimeout(() => fw.waitStop(true).then(() => box.remove()), 8500)
}
const done = (method = 'Hold') => { if (blown) return; blown = true; track.candles(method); document.querySelectorAll('.fl').forEach(x => { x.classList.remove('lean'); x.classList.add('out'); const w = document.createElement('b'); w.className = 'smoke'; w.style.left = x.style.left; $('.cake').append(w) }); burst(); launchFireworks(); mb.play().catch(() => {}); setVol(.12)
  $('#st').textContent = f.after; $('#ask').style.opacity = 0; $('#blow').style.display = $('#mic').style.display = 'none'
  setTimeout(() => { $('#bottle').classList.add('up'); chime.play().catch(() => {}) }, 2500) }
let ht; const bl = $('#blow')
bl.onpointerdown = e => { e.preventDefault(); try { bl.setPointerCapture(e.pointerId) } catch {} document.querySelectorAll('.fl').forEach(x => x.classList.add('lean')); navigator.vibrate?.(8); ht = setTimeout(() => done('Hold'), 900) }
const rel = () => { clearTimeout(ht); if (!blown) document.querySelectorAll('.fl').forEach(x => x.classList.remove('lean')) }
bl.onpointerup = bl.onpointercancel = rel
addEventListener('contextmenu', e => { if (e.target.closest('#blow,.cake,button')) e.preventDefault() })
$('#mic').onclick = async () => { try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }), ac = new AudioContext(), an = ac.createAnalyser(); ac.createMediaStreamSource(st).connect(an)
  const d = new Uint8Array(an.fftSize); const chk = () => { an.getByteTimeDomainData(d); let m = 0; d.forEach(v => m = Math.max(m, Math.abs(v - 128))); if (m > 70) { st.getTracks().forEach(t => t.stop()); done('Mic') } else if (!blown) requestAnimationFrame(chk) }; chk()
  $('#mic').textContent = '...' } catch { $('#mic').textContent = f.btnHold } }
// bottle note
$('#bottle').onclick = () => { $('#modal').classList.add('on'); track.bottle() }; $('#close').onclick = () => $('#modal').classList.remove('on')
gsap.from('.gift', { y: 160, opacity: 0, duration: 3, scrollTrigger: { trigger: '#end', start: 'top 50%' } })
gsap.utils.toArray('.end p').forEach(el => gsap.from(el, { opacity: 0, y: 20, duration: 1.4, scrollTrigger: { trigger: el, start: 'top 85%' } }))

// real sea in the hero (dusk) and at the end (dawn)
const still = matchMedia('(prefers-reduced-motion: reduce)').matches
sea(document.querySelector('.hero'), DUSK, { low, still }); sea(document.getElementById('surf'), DAWN, { low, still })

// falling maple leaves over the "Happy 20, Subha." (#surf) and gift (#end) sections
if (!still) {
  const leafOpts = { shapes: ['maple'], count: low ? 18 : 28, size: [16, 30], speed: [0.6, 1.4], wind: [-0.4, 0.7], opacity: 0.9, autoStart: false }
  const leafMap = new Map([
    [$('#surf'), new FallingLeaves({ ...leafOpts, container: $('#surf'), zIndex: 3 })],
    [$('#end'), new FallingLeaves({ ...leafOpts, container: $('#end'), zIndex: 2 })]
  ])
  const leafIO = new IntersectionObserver(es => es.forEach(e => {
    const fx = leafMap.get(e.target)
    if (fx) e.isIntersecting ? fx.start() : fx.stop()
  }), { threshold: 0 })
  leafMap.forEach((_, el) => el && leafIO.observe(el))

  // sakura-js cherry blossom petals in the #izo tribute section
  const Sakura = new Function(sakuraRaw + '; return Sakura;')()
  const izoEl = $('#izo')
  let sakuraFx = null
  if (izoEl) {
    new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        if (!sakuraFx) sakuraFx = new Sakura('#izo', { fallSpeed: 1.4, delay: low ? 550 : 380, maxSize: 16, minSize: 9, hideScrollbars: false })
        else if (!izoEl.dataset.sakuraAnimId) sakuraFx.start()
      } else if (sakuraFx) {
        sakuraFx.stop(true)
      }
    }, { threshold: 0 }).observe(izoEl)
  }
}

// bubbles drift up a little more as you scroll
gsap.utils.toArray('.bub').forEach(b => gsap.to(b, { y: -240, ease: 'none', scrollTrigger: { trigger: b.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6 } }))
// ship stays on the horizon line
const hero = document.querySelector('.hero'), setHy = () => { const W = hero.clientWidth, H = hero.offsetHeight; hero.style.setProperty('--hy', Math.round(.639 * 1000 * Math.max(W / 1200, H / 1000)) + 'px') }
new ResizeObserver(setHy).observe(hero); setHy()

track.init()
