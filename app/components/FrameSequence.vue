<script setup lang="ts">
// 电脑版滚动动画：那句话（在第一页下面的黑色里）→ 一张图 → 两格 → 三格 → 四格 → ARCHIVE
//
// 原理：
// - 外层 section 很高，里面的 .sticky 固定在屏幕上（position: sticky）
// - 滚动时算出滚了几屏 progress，再用它控制每个元素的透明度和位置
// - 四张图最后停在四栏的位置，就是 Archive 的第一行，之后不再移动
import { categories, firstFrames } from '~/data/archive'

const section = ref<HTMLElement>()
const intro = ref<HTMLElement>()
const row = ref<HTMLElement>()
const progress = ref(0)

// ---------- 时间轴 ----------
// 单位是"屏"：往下滚一整屏 = 1。想调节奏，改这里的数字就行
// 0 = 这一段刚好顶到屏幕上方；负数 = 这一段还在从下面滑上来
// 图一停住就开始展开，中间不停顿
const SCREENS = 1.0 // 整段动画的滚动距离
const T = {
  k2: [0.00, 0.25], // 出现第二格
  k3: [0.25, 0.50], // 出现第三格
  k4: [0.50, 0.75], // 出现第四格
  archiveIn: [0.75, 1.00],
  actionsIn: [-0.5, 0], // 底部一排：图滑上来时淡入
  actionsOut: [0.35, 0.60], // 在四张图展开前淡出，不和卡片文字重叠
} as const
const ARCHIVE_AT = 1.0 // 点 ARCHIVE 跳到这里：Archive 已完全出现

// 那句话：按它在屏幕上的高度（0 = 顶，1 = 底）淡入淡出
// 一往下拉就出现，图的上边出现之前就消失
const PHRASE = { in: [1.0, 0.9], out: [0.8, 0.64] } as const

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

const phraseY = ref(1) // 那句话的中心在屏幕上的高度
const phrase = ref<HTMLElement>()
const phraseOpacity = computed(() => {
  const y = -phraseY.value // 取负数，ramp 才是从小到大
  return ramp(y, [-PHRASE.in[0], -PHRASE.in[1]]) - ramp(y, [-PHRASE.out[0], -PHRASE.out[1]])
})
const archiveOpacity = computed(() => ramp(progress.value, T.archiveIn))
const actionsOpacity = computed(() => Math.min(ramp(progress.value, T.actionsIn), 1 - ramp(progress.value, T.actionsOut)))

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
  // 滚了几屏：从 .sticky 顶到屏幕上方开始算（前面那段黑色不算）
  const scrolled = (-el.getBoundingClientRect().top - (intro.value?.offsetHeight ?? 0)) / window.innerHeight
  progress.value = Math.min(Math.max(scrolled, -1), SCREENS)
  const r = phrase.value?.getBoundingClientRect()
  if (r) phraseY.value = (r.top + r.height / 2) / window.innerHeight
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
    <div class="archive-anchor" data-anchor="archive" :style="{ top: `calc(var(--intro) + ${ARCHIVE_AT * 100}vh)` }" />

    <!-- 那句话压在第一页和第二页的边线正中，跟着正常滚动，两句一起出现 -->
    <div ref="intro" class="intro">
      <p ref="phrase" class="phrase" :style="{ opacity: phraseOpacity }">
        Exploring the digital.&emsp;Feeling the physical.
      </p>
    </div>

    <div class="sticky" :style="{ '--archive': archiveOpacity }">
      <div class="container texts">
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
            <!-- 第一个大类名（PRODUCTIONS）等第二格出现时才一起出现，第二页上只有图 -->
            <p class="cat-title label" :data-cat="categories[i]!.key" :style="i === 0 ? { opacity: frameOpacity(1) } : undefined">{{ categories[i]!.title }} <span class="tagline">— {{ categories[i]!.tagline }}</span></p>
            <ArchiveCard :item="item" :lazy="false" />
          </div>
        </div>
      </div>

      <!-- 和首页一样的底部一排 -->
      <div
        class="container bottom"
        :style="{ opacity: actionsOpacity, visibility: actionsOpacity > 0 ? 'visible' : 'hidden' }"
      >
        <BottomActions />
      </div>
    </div>
  </section>
</template>

<style scoped>
.seq {
  --intro: 0px; /* 图前面多加的黑色，0 = 第一页下面直接是图这一段 */
  position: relative;
  height: calc(var(--intro) + 200vh); /* 动画的滚动距离 = 200vh - 100vh = 1 屏，和 SCREENS 保持一致 */
}

.intro {
  position: relative;
  z-index: 1; /* 盖在第一页的视频上 */
  height: var(--intro);
  text-align: center;
}

/* 句子的中心正好在边线上 */
.intro .phrase {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  transform: translateY(-50%);
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

.bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 48px;
}

.texts {
  position: relative;
  flex: 1;
}

.phrase {
  margin: 0;
  font-size: clamp(22px, 2.6vw, 44px);
  font-weight: 300;
  letter-spacing: 0;
  white-space: nowrap;
}

.archive-title {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  margin: 0;
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

/* 大类名跟着自己那一格一起出现（格子的透明度） */
.label {
  margin: 0 0 14px;
}

/* 卡片下面的小字在最后和 ARCHIVE 一起出现 */
.cell :deep(.card-caption) {
  opacity: var(--archive);
}
</style>
