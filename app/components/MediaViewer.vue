<script setup lang="ts">
// 一个作品只用一个媒体窗口：多张图时左右切换，一张图时不显示箭头
import type { Media } from '~/data/archive'

const props = defineProps<{ media: Media[], title: string }>()

const index = ref(0)
const count = computed(() => props.media.length)
const current = computed(() => props.media[index.value])

function go(step: number) {
  index.value = (index.value + step + count.value) % count.value
}

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
  <div class="viewer" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
    <div class="stage">
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
        :src="`https://www.youtube-nocookie.com/embed/${current.src}?autoplay=1&mute=1&playsinline=1&rel=0&start=${current.start ?? 0}`"
        :title="current.alt ?? title"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
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
          <img :src="current.src" :alt="current.alt ?? title">
        </a>
        <img v-else :key="current.src" :src="current.src" :alt="current.alt ?? title">
      </template>
      <span v-else class="placeholder">IMAGE / VIDEO</span>
    </div>

    <div v-if="count > 1" class="nav">
      <button aria-label="Previous" @click="go(-1)">←</button>
      <span>{{ index + 1 }} / {{ count }}</span>
      <button aria-label="Next" @click="go(1)">→</button>
    </div>
  </div>
</template>

<style scoped>
.viewer {
  position: relative;
  background: #0b0b0b;
}

.stage {
  aspect-ratio: 16 / 9;
  display: grid;
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
}

.nav button {
  min-width: 44px;
  min-height: 44px;
  font-size: 20px;
}
</style>
