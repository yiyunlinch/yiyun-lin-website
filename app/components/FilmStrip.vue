<script setup lang="ts">
// 一条胶片：图片从左到右排成一行，一样高，左右滑动；两边有 ← → 箭头（和 MENU ↗ 一样的字），点一下滑一张
import type { Media } from '~/data/archive'

defineProps<{ media: Media[], title: string }>()

const strip = ref<HTMLElement>()
const canLeft = ref(false)
const canRight = ref(false)

// 滑到最左就不显示左箭头，滑到最右就不显示右箭头
function update() {
  const el = strip.value
  if (!el) return
  canLeft.value = el.scrollLeft > 2
  canRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2
}

// 滑到下一张 / 上一张图的左边
function go(step: number) {
  const el = strip.value
  if (!el) return
  const imgs = [...el.querySelectorAll('img')]
  const x = el.scrollLeft
  const target = step > 0
    ? imgs.find(img => img.offsetLeft > x + 2)
    : imgs.reverse().find(img => img.offsetLeft < x - 2)
  el.scrollTo({ left: target ? target.offsetLeft : (step > 0 ? el.scrollWidth : 0), behavior: 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('resize', update)
})
onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<template>
  <div class="film">
    <div ref="strip" class="strip" @scroll.passive="update">
      <img v-for="m in media" :key="m.src" :src="m.src" :alt="m.alt ?? title" @load="update">
    </div>
    <button v-show="canLeft" class="arrow left" aria-label="Previous" @click="go(-1)">←</button>
    <button v-show="canRight" class="arrow right" aria-label="Next" @click="go(1)">→</button>
  </div>
</template>

<style scoped>
.film {
  position: relative;
  margin-top: 28px;
}

.strip {
  container-type: inline-size;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #444 transparent;
}

/* 高度是普通画框的 70%（画框高 = 宽 × 9/16，最多 100vh - 220px） */
.strip img {
  display: block;
  flex: none;
  width: auto;
  height: calc(0.7 * min(100cqw * 9 / 16, 100vh - 220px));
}

/* 手机：屏幕窄，图片高一点（画框宽的 70%） */
@media (max-width: 899px) {
  .strip img {
    height: 70cqw;
  }
}

/* 箭头和 MENU ↗ 一样：同一个字体、同样大小；电脑上放在图片外面的黑边上，手机上压在图片上 */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: var(--fg);
  font-size: var(--label);
  opacity: 0.85;
  transition: opacity 0.3s;
}

.arrow:hover {
  opacity: 1;
}

.arrow.left {
  left: 0;
}

.arrow.right {
  right: 0;
}

/* 手机：箭头压在图片上，垫一块半透明的黑底，白色的画上也看得见 */
@media (max-width: 899px) {
  .arrow {
    width: 36px;
    height: 36px;
    background: rgba(0, 0, 0, 0.45);
  }
}

/* 电脑：箭头在页面左右留白（--pad）里，不会跑出屏幕 */
@media (min-width: 900px) {
  .arrow {
    width: var(--pad);
  }

  .arrow.left {
    left: calc(-1 * var(--pad));
  }

  .arrow.right {
    right: calc(-1 * var(--pad));
  }
}
</style>
