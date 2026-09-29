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
// 0 = Mrs Mills 的图整张露出来的那一刻（马上开始往左下方移动，出现右边的图）
// progress 本身：0 = .sticky 刚好顶到屏幕上方；负数 = 还在从下面滑上来
const T = {
  k2: [0.00, 0.25], // 出现第二格
  k3: [0.125, 0.375], // 出现第三格：第二格出现一半就开始，整排往左移
  k4: [0.375, 0.625], // 出现第四格：接着第三格，中间不停
  titleIn: [0.00, 0.625], // 左上角 ARCHIVE：图一开始变小往左走就出现
  archiveIn: [0.625, 0.875], // 卡片下面的小字
  actionsIn: [-0.8, -0.2], // 底部一排：图滑上来时就开始淡入
  actionsOut: [0.45, 0.625], // 最后一小段淡出：卡片下面的小字（archiveIn）开始出现时刚好消失
} as const
const DURATION = 0.875 // 从图整张露出来到 Archive 完全出现，滚几屏

// 那句话：一往下拉就出现（按它在屏幕上的高度，0 = 顶，1 = 底）
// Mrs Mills 的图露出来时淡出，图露出一半时完全消失（按图露出了几成，0 → 1）
const PHRASE = { in: [0.99, 0.89], out: [0.1, 0.5] } as const

// 把 p 在 [a, b] 之间映射成 0 → 1，并做缓动
function ramp(p: number, [a, b]: readonly number[]) {
  const t = Math.min(Math.max((p - a!) / (b! - a!), 0), 1)
  return t * t * (3 - 2 * t)
}

// 时间轴上的位置：从图整张露出来的那一刻算起
const t = computed(() => progress.value - layout.start)

// 现在"打开了几格"：1 → 4，中间是小数，表示正在过渡
const frames = computed(() => 1 + ramp(t.value, T.k2) + ramp(t.value, T.k3) + ramp(t.value, T.k4))

const phraseY = ref(1) // 那句话的中心在屏幕上的高度
const imageShown = ref(0) // 第一张图露出了几成
const phrase = ref<HTMLElement>()
const phraseOpacity = computed(() => {
  const y = -phraseY.value // 取负数，ramp 才是从小到大
  return ramp(y, [-PHRASE.in[0], -PHRASE.in[1]]) * (1 - ramp(imageShown.value, PHRASE.out))
})
const titleOpacity = computed(() => ramp(t.value, T.titleIn))
const archiveOpacity = computed(() => ramp(t.value, T.archiveIn))
const actionsOpacity = computed(() => Math.min(ramp(t.value, T.actionsIn), 1 - ramp(t.value, T.actionsOut)))

// ---------- 四张图这一行的位置 ----------
// layout 在页面加载和窗口大小改变时测量一次
const layout = reactive({ width: 0, gap: 0, imageCenter: 0, lift: 0, start: 0 })
// .sticky 停住后还要滚几屏（动画在 .sticky 停住前就开始了，所以比 DURATION 短）
const screens = computed(() => DURATION + layout.start)

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
  // 图（放大 1.8 倍）的下边在 .sticky 里的高度 → 滑到屏幕底部时的 progress
  const bottom = sticky.offsetHeight * 0.55 + 0.9 * firstFrame.offsetHeight
  layout.start = Math.min(0, bottom / window.innerHeight - 1)
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
  progress.value = Math.min(Math.max(scrolled, -1), screens.value)
  const r = phrase.value?.getBoundingClientRect()
  if (r) phraseY.value = (r.top + r.height / 2) / window.innerHeight
  const img = row.value?.querySelector('.frame')?.getBoundingClientRect()
  if (img) imageShown.value = Math.min(Math.max((window.innerHeight - img.top) / img.height, 0), 1)
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
  <section ref="section" class="seq" :style="{ '--screens': screens }">
    <!-- 点 ARCHIVE 跳到这里：Archive 已完全出现 -->
    <div class="archive-anchor" data-anchor="archive" />

    <!-- 那句话压在第一页和第二页的边线正中，跟着正常滚动，两句一起出现 -->
    <div ref="intro" class="intro">
      <p ref="phrase" class="phrase" :style="{ opacity: phraseOpacity }">
        Exploring the digital.&emsp;Feeling the physical.
      </p>
    </div>

    <div class="sticky" :style="{ '--archive': archiveOpacity }">
      <div class="container texts">
        <h2 class="archive-title" :style="{ opacity: titleOpacity }">ARCHIVE</h2>
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
  --intro: 10vh; /* 图前面多加的黑色，让那句话停留久一点 */
  position: relative;
  height: calc(var(--intro) + 100vh + var(--screens) * 100vh); /* .sticky 停住 --screens 屏 */
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
  top: calc(var(--intro) + var(--screens) * 100vh);
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
}

.row-wrap {
  /* 和下面 ArchiveRest 的行距一样，第一行和第二行才对齐 */
  padding-bottom: var(--row-gap);
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: var(--col-gap);
  will-change: transform;
}

/* 大类名跟着自己那一格一起出现（格子的透明度） */
.label {
  margin: 0 0 26px; /* 线和下面的图空开一点 */
}

/* 卡片下面的小字在最后和 ARCHIVE 一起出现 */
.cell :deep(.card-caption) {
  opacity: var(--archive);
}
</style>
