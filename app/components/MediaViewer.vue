<script setup lang="ts">
// 一个作品只用一个媒体窗口：多张图时左右切换，一张图时不显示箭头
import type { Media } from '~/data/archive'

// ratio：画框的比例，默认 16:9；左右两个窗口时照片那边用 4:3
// autoplay：YouTube 自动播放；一页有好几个视频时，只有第一个自动播放
// centerCaption：小字放在图片正下方居中，比图片稍宽一点（竖的图片在 16:9 框里时用）
const props = withDefaults(defineProps<{ media: Media[], title: string, ratio?: string, autoplay?: boolean, centerCaption?: boolean }>(), { autoplay: true })

const index = ref(0)
const count = computed(() => props.media.length)
const current = computed(() => props.media[index.value])

function go(step: number) {
  index.value = (index.value + step + count.value) % count.value
}

// 图片本身的宽高比：用来算图片在框里实际有多宽，小字跟着这个宽度
const imgEl = ref<HTMLImageElement>()
const imgRatio = ref<number>()
function readRatio() {
  const img = imgEl.value
  imgRatio.value = img?.complete && img.naturalWidth ? img.naturalWidth / img.naturalHeight : undefined
}
watch(current, async () => {
  await nextTick()
  readRatio()
})
onMounted(readRatio) // 页面打开前图片可能已经加载好了，这时 @load 不会再触发

// 键盘 ← →
function onKey(e: KeyboardEvent) {
  if (count.value < 2) return
  if (e.key === 'ArrowLeft') go(-1)
  if (e.key === 'ArrowRight') go(1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// 嵌入网站只在电脑上显示；手机上会抢滚动，所以显示录屏视频
// 一开始（服务器渲染时）先当手机处理，页面打开后再判断
const isDesktop = ref(false)
let desktopQuery: MediaQueryList | undefined
function onQueryChange() {
  isDesktop.value = desktopQuery!.matches
}

// 嵌入的网站翻页时会用 scrollIntoView，把外面的页面也一起滚走。
// 所以：等页面停稳后再加载它；之后外面的页面只要不是用户自己滚的，就滚回原位
const frameReady = ref(false)
let lastY = 0
let userUntil = 0
let idleTimer: ReturnType<typeof setTimeout> | undefined

function onUserInput() {
  userUntil = performance.now() + 1000
}
function onPageScroll() {
  if (current.value?.type !== 'site' || !isDesktop.value) return
  if (!frameReady.value) {
    // 还在等页面停稳（比如从首页点进来，正在滚回顶部）
    clearTimeout(idleTimer)
    idleTimer = setTimeout(armFrame, 300)
    return
  }
  if (performance.now() < userUntil) lastY = window.scrollY
  else window.scrollTo({ top: lastY, behavior: 'instant' })
}
function armFrame() {
  lastY = window.scrollY
  frameReady.value = true
}

// 视频点进来就自动播放。浏览器有时不允许有声音的自动播放（比如直接打开网址），
// 那就先静音播放，用户可以在控制条里打开声音
const videoEl = ref<HTMLVideoElement>()
async function autoplay() {
  await nextTick()
  const v = videoEl.value
  if (!v) return
  try {
    await v.play()
  }
  catch {
    v.muted = true
    v.play().catch(() => {})
  }
}
watch(current, autoplay)
onMounted(autoplay)

const userEvents = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const
onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 900px)')
  onQueryChange()
  desktopQuery.addEventListener('change', onQueryChange)
  userEvents.forEach(e => window.addEventListener(e, onUserInput, { passive: true }))
  window.addEventListener('scroll', onPageScroll, { passive: true })
  idleTimer = setTimeout(armFrame, 300)
})
onBeforeUnmount(() => {
  desktopQuery?.removeEventListener('change', onQueryChange)
  userEvents.forEach(e => window.removeEventListener(e, onUserInput))
  window.removeEventListener('scroll', onPageScroll)
  clearTimeout(idleTimer)
})
</script>

<template>
  <div
    class="viewer"
    :data-center-caption="centerCaption || undefined"
    :style="centerCaption ? { '--img-r': imgRatio ?? 1, ...(ratio ? { '--stage-r': ratio } : {}) } : undefined"
    @touchstart.passive="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="box">
    <div class="stage" :data-type="current?.type" :style="ratio ? { aspectRatio: ratio } : undefined">
      <template v-if="current?.type === 'site'">
        <iframe
          v-if="isDesktop"
          :key="current.src"
          :src="frameReady ? current.src : undefined"
          :title="current.alt ?? title"
        />
        <video
          v-else
          :key="current.preview"
          :src="current.preview"
          :poster="current.poster"
          autoplay
          muted
          loop
          playsinline
        />
      </template>
      <!-- YouTube：自动播放。浏览器规定自动播放要静音，点播放器的喇叭开声音 -->
      <iframe
        v-else-if="current?.type === 'youtube'"
        :key="current.src"
        :src="`https://www.youtube-nocookie.com/embed/${current.src}?autoplay=${props.autoplay ? 1 : 0}&mute=1&playsinline=1&rel=0&start=${current.start ?? 0}`"
        :title="current.alt ?? title"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      />
      <!-- Spotify：官方播放器，352px 高时显示大封面图 -->
      <iframe
        v-else-if="current?.type === 'spotify'"
        :key="current.src"
        :src="`https://open.spotify.com/embed/episode/${current.src}`"
        :title="current.alt ?? title"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      <template v-else-if="current">
        <video
          v-if="current.type === 'video'"
          ref="videoEl"
          :key="current.src"
          :src="current.src"
          :poster="current.poster"
          controls
          playsinline
        />
        <a v-else-if="current.href" :key="current.src" :href="current.href" target="_blank" rel="noopener" class="img-link">
          <img ref="imgEl" :src="current.src" :alt="current.alt ?? title" @load="readRatio">
        </a>
        <img v-else ref="imgEl" :key="current.src" :src="current.src" :alt="current.alt ?? title" @load="readRatio">
      </template>
      <span v-else class="placeholder">IMAGE / VIDEO</span>
    </div>

    <div v-if="count > 1" class="nav">
      <button aria-label="Previous" @click="go(-1)">←</button>
      <span>{{ index + 1 }} / {{ count }}</span>
      <button aria-label="Next" @click="go(1)">→</button>
    </div>
    </div>

    <p v-if="current?.caption" class="caption">{{ current.caption }}</p>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  background: #0b0b0b;
}

/* 画框下面的小字，和页面上的 ROLE 一样 */
.caption {
  margin: 10px 0 0;
  font-size: var(--small);
  letter-spacing: 0.08em;
  color: var(--muted);
  white-space: pre-line; /* \n 换行：英文一行，中文一行 */
}

/* 小字居中：框的高 = 宽 / 框的比例，图片的宽 = 高 × 图片的比例，小字两边各多出 40px，但不超过框 */
[data-center-caption] {
  --stage-r: 16 / 9;
  container-type: inline-size;
}

/* 手机：16:9 里竖的图片太小，框改成竖一点 */
@media (max-width: 899px) {
  [data-center-caption] {
    --stage-r: 4 / 5;
  }
}

[data-center-caption] .stage {
  aspect-ratio: var(--stage-r);
}

[data-center-caption] .caption {
  max-width: min(100%, calc(100cqw / (var(--stage-r)) * var(--img-r) + 80px));
  margin-inline: auto;
  text-align: center;
}

.stage {
  aspect-ratio: 16 / 9;
  min-height: 0; /* 竖一点的图片不会把框撑高，框永远是 16:9 */
  overflow: hidden;
  display: grid;
  grid-template: 100% / 100%; /* 格子和框一样大：竖的图片不会把格子撑高、被裁掉 */
  place-items: center;
}

/* 不同比例的图片都完整显示，不裁切 */
.stage img,
.stage video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.img-link {
  width: 100%;
  height: 100%;
}

.stage iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

/* Spotify 播放器自己有圆角和背景，不用 16:9 的黑框 */
.stage[data-type='spotify'] {
  aspect-ratio: auto;
  height: 352px;
}

.box:has(.stage[data-type='spotify']) {
  background: none;
}

.placeholder {
  color: #444;
  font-size: var(--label);
  letter-spacing: 0.2em;
}

.nav {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 6px 18px;
  background: rgba(0, 0, 0, 0.55);
  font-size: var(--label);
  letter-spacing: 0.15em;
  white-space: nowrap; /* 窄窗口里 1 / 9 不会断成三行 */
}

.nav button {
  min-width: 44px;
  min-height: 44px;
  font-size: 20px;
}
</style>
