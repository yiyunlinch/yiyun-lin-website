// 首页背景声音：每次载入都先试着直接播放；
// 浏览器不允许的话（大部分第一次来的访客），等第一次点击 / 按键再慢慢出来
// 用 Web Audio 循环播放：没有接缝的停顿，而且 iPhone 上也能淡入淡出
// 两条声音，按滚动位置交替：
// - sound.m4a：第一页的雾气声（音量已经降到 2.25%，首尾做过 2 秒等功率交叉淡化）
// - sound2.m4a：Archive 的音乐，来自 SHANGHAI FRINGE FESTIVAL 的视频（maxidance.mp4，降到约 -46 LUFS，首尾也交叉淡化过）
// - sound3.m4a：About me 的音乐，Pixabay 上 kalsstockmedia 的 Shri Ramaya Namaha（同样 -46 LUFS，交叉淡化过）
// 作品页里没有背景声音
import { findAnchor } from './useAnchor'

const on = ref(true)
let started = false
let ctx: AudioContext | null = null
let loading: Promise<unknown> | null = null

// 滚动时把 p 在 [a, b] 之间映射成 0 → 1
const between = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)))

// 某个 data-anchor 的上边在页面里的位置，单位"屏"；找不到就返回 undefined
function anchorAt(name: string) {
  const el = findAnchor(name)
  return el ? (el.getBoundingClientRect().top + scrollY) / innerHeight : undefined
}

const tracks: { src: string, level: () => number, gain?: GainNode }[] = [
  // 雾气：半页以内音量不变，到 1.5 页时完全消失
  { src: '/photo/sound.m4a', level: () => 1 - between(scrollY / innerHeight, 0.5, 1.5) },
  // Archive 的音乐：第二页快结束时（Archive 完全出现前半屏）淡入，About 从屏幕下边露出来时淡出
  {
    src: '/photo/sound2.m4a',
    level: () => {
      const archive = anchorAt('archive')
      if (archive === undefined) return 0
      const y = scrollY / innerHeight
      const about = anchorAt('about') ?? Infinity
      return between(y, archive - 0.5, archive) * (1 - between(y, about - 1, about - 0.7))
    },
  },
  // About me 的音乐：上一首完全淡掉后才出来，一直放到页面最底
  {
    src: '/photo/sound3.m4a',
    level: () => {
      const about = anchorAt('about')
      if (about === undefined) return 0
      // 页面太短、滚不到 about - 0.3 时，滚到底就是最大音量
      const end = Math.min(about - 0.3, (document.documentElement.scrollHeight - innerHeight) / innerHeight)
      return between(scrollY / innerHeight, Math.min(about - 0.7, end - 0.1), end)
    },
  },
]

async function load(track: typeof tracks[number]) {
  const data = await fetch(track.src).then(r => r.arrayBuffer())
  const buffer = await ctx!.decodeAudioData(data)
  const source = ctx!.createBufferSource()
  source.buffer = buffer
  source.loop = true
  source.connect(track.gain!)
  source.start()
}

// 开 / 关时 1 秒慢慢变化；滚动时跟得快一点
function fadeTo(seconds: number) {
  if (!ctx) return
  const home = location.pathname === '/'
  const now = ctx.currentTime
  for (const { gain, level } of tracks) {
    if (!gain) continue
    const value = on.value && home ? level() : 0
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(value, now + seconds)
  }
}

const onScroll = () => fadeTo(0.2)

// 浏览器只在允许的情况下让 AudioContext 变成 running
function start() {
  if (!ctx) {
    ctx = new AudioContext()
    for (const track of tracks) {
      track.gain = ctx.createGain()
      track.gain.gain.value = 0
      track.gain.connect(ctx.destination)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    if (import.meta.dev) (window as any).__snd = { ctx, tracks }
  }
  loading ??= Promise.all(tracks.map(load))
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
