// Real-looking sea: a small WebGL shader (waves, sky reflection, sun glitter). Falls back to the paper waves if WebGL is missing.
const FS = `precision highp float;
uniform vec2 uRes; uniform float uT, uSunX; uniform vec3 uHorC, uHorE, uZen, uSunC, uDeep, uShal;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float hgt(vec2 p){
 p+=vec2(sin(p.y*.55+uT*.35),cos(p.x*.5+uT*.28))*.45;          // wobble so crests are not straight lines
 float h=0.;
 h+=sin(dot(p,vec2(.55,.35))*.9+uT*.8)*.85;                      // long swell
 h+=sin(dot(p,vec2(-.4,.7))*1.5+uT*1.0)*.45;
 h+=sin(dot(p,vec2(.8,-.5))*2.6+uT*1.5)*.22;                      // chop
 h+=(fbm(p*2.2+vec2(uT*.45,uT*.25))-.5)*.5;                       // small ripples
 return h;}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes; uv.y=1.-uv.y;
 float d=1./(uv.y+.035);
 vec2 p=vec2((uv.x-.5)*d*2.2, d*1.6+uT*.55);
 float e=.06, far=smoothstep(5.,26.,d);
 float h=hgt(p);
 float gx=(hgt(p+vec2(e,0.))-hgt(p-vec2(e,0.)))/(2.*e), gz=(hgt(p+vec2(0.,e))-hgt(p-vec2(0.,e)))/(2.*e);
 float amp=.42*(1.-far*.8);
 vec3 n=normalize(vec3(-gx*amp,1.,-gz*amp));
 vec3 V=normalize(vec3((uv.x-.5)*.5,.07+uv.y*.8,-1.));
 vec3 R=reflect(-V,n); R.y=abs(R.y);
 float F=.02+.98*pow(1.-max(dot(n,V),0.),5.);
 float t=clamp(R.y*1.6,0.,1.);
 vec3 hor=mix(uHorE,uHorC,exp(-pow((uv.x-uSunX)*2.4,2.)));
 vec3 sky=mix(hor,uZen,pow(t,.5));
 vec3 L=normalize(vec3((uSunX-.5)*.5,.1,1.));
 float s=max(dot(R,L),0.);
 float spec=pow(s,260.)*1.1+pow(s,36.)*.28;
 float face=max(dot(n,normalize(vec3(L.x,.55,L.z))),0.);          // slopes that face the sun glow warm, the others stay dark
 float lit=smoothstep(-.9,1.1,h);
 vec3 body=mix(uDeep,uShal,clamp(lit*.75,0.,1.))*(.55+.7*face)+uSunC*.12*pow(face,3.)*(1.-far);
 vec3 col=mix(body,sky,clamp(F*.9,0.,1.))+uSunC*spec*(1.-far*.4)*(1.-uv.y*.5);
 float crest=smoothstep(.75,1.25,h+fbm(p*3.5+vec2(uT*.3,0.))*.5-.1);
 float foam=crest*(.35+.65*fbm(p*9.))*(1.-far*.7);
 col=mix(col,vec3(.93,.96,.94),clamp(foam*.55,0.,.6));
 col=mix(hor,col,smoothstep(0.,.06,uv.y));
 col*=1.-uv.y*.2;
 gl_FragColor=vec4(col,1.);}`
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
export const DUSK = { horC: [.98, .88, .65], horE: [.96, .79, .55], zen: [.2, .3, .42], sun: [1, .9, .66], deep: [.06, .2, .26], shal: [.13, .38, .42], sunX: .533 }
export const DAWN = { horC: [.97, .87, .62], horE: [.97, .89, .65], zen: [.34, .52, .62], sun: [1, .92, .72], deep: [.1, .33, .4], shal: [.24, .55, .55], sunX: .533 }

export function sea(sec, pal, { low = false, still = false } = {}) {
  const cv = document.createElement('canvas'); cv.className = 'sea'
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
  if (!gl) return false
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null }
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return false
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr)
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false
  gl.useProgram(pr)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const U = n => gl.getUniformLocation(pr, n)
  const [uRes, uT, uSunX] = [U('uRes'), U('uT'), U('uSunX')]
  gl.uniform3fv(U('uHorC'), pal.horC); gl.uniform3fv(U('uHorE'), pal.horE); gl.uniform3fv(U('uZen'), pal.zen)
  gl.uniform3fv(U('uSunC'), pal.sun); gl.uniform3fv(U('uDeep'), pal.deep); gl.uniform3fv(U('uShal'), pal.shal)
  sec.prepend(cv)
  const q = low ? .45 : .7; let ok = false
  const lay = () => { // the sky picture is 1200x1000 with the horizon at 63.9% - place the sea right under that line
    const W = sec.clientWidth, H = sec.offsetHeight, s = Math.max(W / 1200, H / 1000), iw = 1200 * s, ox = (W - iw) / 2, hy = Math.round(.639 * 1000 * s) - 1
    if (H - hy < 10) return
    cv.style.top = hy + 'px'; cv.style.height = (H - hy) + 'px'
    cv.width = Math.round(W * q); cv.height = Math.round((H - hy) * q); gl.viewport(0, 0, cv.width, cv.height)
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uSunX, (ox + pal.sunX * iw) / W); ok = true; draw(still ? 3 : (performance.now() - t0) / 1000)
  }
  const draw = t => { if (!ok) return; gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLES, 0, 3) }
  const t0 = performance.now(); let on = false, last = 0
  const loop = now => { if (!on) return; if (now - last > 33) { last = now; draw((now - t0) / 1000) } requestAnimationFrame(loop) }
  new ResizeObserver(lay).observe(sec); lay()
  if (!still) new IntersectionObserver(e => { on = e[0].isIntersecting && !document.hidden; if (on) requestAnimationFrame(loop) }, { threshold: 0 }).observe(sec)
  sec.classList.add('sea-on'); return true
}
