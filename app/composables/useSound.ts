// 首页背景声音：每次载入都先试着直接播放；
// 浏览器不允许的话（大部分第一次来的访客），等第一次点击 / 按键再慢慢出来
// 用 Web Audio 循环播放：没有接缝的停顿，而且 iPhone 上也能淡入淡出
// （音量已经在 sound.m4a 里降到 2.25%，首尾也做过 2 秒等功率交叉淡化）
const on = ref(true)
let started = false
let ctx: AudioContext | null = null
let gain: GainNode | null = null
let loading: Promise<void> | null = null

async function load() {
  const data = await fetch('/photo/sound.m4a').then(r => r.arrayBuffer())
  const buffer = await ctx!.decodeAudioData(data)
  const source = ctx!.createBufferSource()
  source.buffer = buffer
  source.loop = true
  source.connect(gain!)
  source.start()
}

// 首页往下滚：半页以内音量不变，到 1.5 页时完全消失；其他页面没有声音
function scrollLevel() {
  if (location.pathname !== '/') return 0
  const t = (scrollY / innerHeight - 0.5) / (1.5 - 0.5)
  return Math.min(1, Math.max(0, 1 - t))
}

// 开 / 关时 1 秒慢慢变化；滚动时跟得快一点
function fadeTo(seconds: number) {
  if (!ctx || !gain) return
  const value = on.value ? scrollLevel() : 0
  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(value, now + seconds)
}

const onScroll = () => fadeTo(0.2)

// 浏览器只在允许的情况下让 AudioContext 变成 running
function start() {
  if (!ctx) {
    ctx = new AudioContext()
    gain = ctx.createGain()
    gain.gain.value = 0
    gain.connect(ctx.destination)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (import.meta.dev) (window as any).__snd = { ctx, gain }
  }
  loading ??= load()
  // 被浏览器挡住时 resume() 会一直等，直到访客点击
  Promise.all([ctx.resume(), loading]).then(() => {
    if (ctx!.state !== 'running') return
    started = true
    stopWaiting()
    fadeTo(1)
  })
}

const gestures = ['pointerdown', 'keydown', 'touchend'] as const
function onFirstGesture(e: Event) {
  // 第一次就点在 SOUND 按钮上的话，交给按钮自己处理
  if ((e.target as Element | null)?.closest?.('.sound-btn')) return
  stopWaiting()
  if (on.value && !started) start()
}
function stopWaiting() {
  gestures.forEach(g => window.removeEventListener(g, onFirstGesture, true))
}

let ready = false
export function useSound() {
  const router = useRouter()

  onMounted(() => {
    if (ready) return
    ready = true
    gestures.forEach(g => window.addEventListener(g, onFirstGesture, true))
    router.afterEach(() => nextTick(() => fadeTo(1)))
    start() // 载入就试着播放
  })

  function toggle() {
    // 还没出过声（显示 SOUND ↗ 但在等点击）：这一下就是开始播放
    if (on.value && !started) return start()
    on.value = !on.value
    if (on.value) start()
    else fadeTo(1)
  }
  return { on: readonly(on), toggle }
}
