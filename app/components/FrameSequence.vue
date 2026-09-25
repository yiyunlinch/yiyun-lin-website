<script setup lang="ts">
// 电脑版滚动动画：一张图（上面是那句话）→ 两格 → 三格 → 四格 → ARCHIVE
//
// 原理：
// - 外层 section 很高，里面的 .sticky 固定在屏幕上（position: sticky）
// - 滚动时算出滚了几屏 progress，再用它控制每个元素的透明度和位置
// - 四张图最后停在四栏的位置，就是 Archive 的第一行，之后不再移动
import { categories, firstFrames } from '~/data/archive'

const section = ref<HTMLElement>()
const row = ref<HTMLElement>()
const progress = ref(0)

// ---------- 时间轴 ----------
// 单位是"屏"：往下滚一整屏 = 1。想调节奏，改这里的数字就行
// 0 = 这一段刚好顶到屏幕上方；负数 = 这一段还在从下面滑上来
const SCREENS = 1.6 // 整段动画的滚动距离
const T = {
  k2: [0.20, 0.45], // 出现 03
  k3: [0.45, 0.70], // 出现 04
  k4: [0.70, 0.95], // 出现 05
  phraseIn: [-0.5, 0], // 滑上来时淡入，到第二页就完全出现
  phraseOut: [1.00, 1.15],
  archiveIn: [1.20, 1.45],
} as const
const ARCHIVE_AT = 1.5 // 点 ARCHIVE 跳到这里：Archive 已完全出现

// 把 p 在 [a, b] 之间映射成 0 → 1，并做缓动
function ramp(p: number, [a, b]: readonly number[]) {
  const t = Math.min(Math.max((p - a!) / (b! - a!), 0), 1)
  return t * t * (3 - 2 * t)
}

// 现在"打开了几格"：1 → 4，中间是小数，表示正在过渡
const frames = computed(() => {
  const p = progress.value
  return 1 + ramp(p, T.k2) + ramp(p, T.k3) + ramp(p, T.k4)
})

const phraseOpacity = computed(() => ramp(progress.value, T.phraseIn) - ramp(progress.value, T.phraseOut))
const archiveOpacity = computed(() => ramp(progress.value, T.archiveIn))

// ---------- 四张图这一行的位置 ----------
// layout 在页面加载和窗口大小改变时测量一次
const layout = reactive({ width: 0, gap: 0, imageCenter: 0, lift: 0 })

function measure() {
  const rowEl = row.value
  const sticky = rowEl?.offsetParent as HTMLElement | null
  if (!rowEl || !sticky) return // 手机上这部分是隐藏的，不用测
  const firstFrame = rowEl.querySelector<HTMLElement>('.frame')!
  layout.width = rowEl.offsetWidth
  layout.gap = parseFloat(getComputedStyle(rowEl).columnGap) || 0
  // 图片中心在这一行里的高度
  layout.imageCenter = firstFrame.offsetTop + firstFrame.offsetHeight / 2
  // 只有一张图时，把它往上移到屏幕中间偏下
  layout.lift = rowEl.offsetTop + layout.imageCenter - sticky.offsetHeight * 0.55
}

const rowStyle = computed(() => {
  const k = frames.value
  const step = (layout.width + layout.gap) / 4 // 一格宽 + 间距
  const groupCenter = (k * step - layout.gap) / 2 // 已出现的图的中心
  const rest = (4 - k) / 3 // 1 = 只有一张，0 = 四张全开
  return {
    transformOrigin: `${groupCenter}px ${layout.imageCenter}px`,
    transform: `translate(${layout.width / 2 - groupCenter}px, ${-layout.lift * rest}px) scale(${1 + 0.8 * rest})`,
  }
})

function frameOpacity(i: number) {
  return Math.min(Math.max(frames.value - i, 0), 1)
}

// ---------- 滚动监听 ----------
let raf = 0
function update() {
  raf = 0
  const el = section.value
  if (!el) return
  const scrolled = -el.getBoundingClientRect().top / window.innerHeight // 滚了几屏
  progress.value = Math.min(Math.max(scrolled, -1), SCREENS)
}
function onScroll() {
  raf ||= requestAnimationFrame(update)
}
function onResize() {
  measure()
  update()
}

onMounted(() => {
  onResize()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  // 字体加载完后布局可能变化，再测一次
  document.fonts?.ready.then(onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section ref="section" class="seq">
    <div class="archive-anchor" data-anchor="archive" :style="{ top: `${ARCHIVE_AT * 100}vh` }" />

    <div class="sticky" :style="{ '--archive': archiveOpacity }">
      <div class="container texts">
        <!-- 两句话一起出现，不分开做动画 -->
        <p class="stage-title phrase" :style="{ opacity: phraseOpacity }">
          Exploring the digital.&emsp;Feeling the physical.
        </p>

        <h2 class="archive-title">ARCHIVE</h2>
      </div>

      <div class="container row-wrap">
        <div ref="row" class="row" :style="rowStyle">
          <div
            v-for="(item, i) in firstFrames"
            :key="item.slug"
            class="cell"
            :style="{ opacity: frameOpacity(i) }"
          >
            <p class="eyebrow label">{{ categories[i]!.title }}</p>
            <ArchiveCard :item="item" :lazy="false" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.seq {
  position: relative;
  height: 260vh; /* 滚动距离 = 260vh - 100vh = 1.6 屏，和 SCREENS 保持一致 */
}

.archive-anchor {
  position: absolute;
  left: 0;
  height: 1px;
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.texts {
  position: relative;
  flex: 1;
}

.stage-title,
.phrase,
.archive-title {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  margin: 0;
}

.stage-title {
  top: 16vh;
  text-align: center;
  font-size: clamp(28px, 3.6vw, 60px);
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.phrase {
  font-size: clamp(22px, 2.6vw, 44px);
  font-weight: 300;
  letter-spacing: 0;
}

.archive-title {
  top: 14vh;
  font-size: clamp(48px, 7vw, 120px);
  font-weight: 500;
  line-height: 1;
  opacity: var(--archive);
}

.row-wrap {
  /* 和下面 ArchiveRest 的行距一样，第一行和第二行才对齐 */
  padding-bottom: calc(var(--gap) * 2);
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap);
  will-change: transform;
}

.label {
  margin: 0 0 14px;
  opacity: var(--archive);
}

/* 分类名和小字在最后和 ARCHIVE 一起出现 */
.cell :deep(.card-caption) {
  opacity: var(--archive);
}
</style>
