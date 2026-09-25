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

// 手机：左右滑动
let startX = 0
function onTouchStart(e: TouchEvent) {
  startX = e.touches[0]!.clientX
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - startX
  if (count.value > 1 && Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
}
</script>

<template>
  <div class="viewer" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
    <div class="stage">
      <template v-if="current">
        <video
          v-if="current.type === 'video'"
          :key="current.src"
          :src="current.src"
          controls
          playsinline
        />
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

.placeholder {
  color: #444;
  font-size: 14px;
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
  font-size: 14px;
  letter-spacing: 0.15em;
}

.nav button {
  min-width: 44px;
  min-height: 44px;
  font-size: 20px;
}
</style>
