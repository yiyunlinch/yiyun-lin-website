<script setup lang="ts">
import { items, placeOf } from '~/data/archive'

const route = useRoute()
const { goTo } = useAnchor()

const item = computed(() => items.find(i => i.slug === route.params.slug))

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

useHead({ title: () => `${item.value?.title} — YIYUN LIN` })

// 视频 / 图片最多用到屏幕底部往上 40px，整个作品在第一屏里就能看完
// （最少 360px 高，文字很多的页面才需要往下滚一点）
type ViewerRef = HTMLElement | { $el: HTMLElement }
const viewer = ref<ViewerRef | ViewerRef[] | null>(null)
const fitHeight = ref<number | null>(null)
function fit() {
  // 多段的页面里 ref 写在 v-for 中，拿到的是数组
  const v = Array.isArray(viewer.value) ? viewer.value[0] : viewer.value
  const el = v instanceof HTMLElement ? v : v?.$el
  if (!el) return
  const top = el.getBoundingClientRect().top + scrollY
  fitHeight.value = Math.max(360, innerHeight - top - 40)
}
onMounted(() => {
  fit()
  window.addEventListener('resize', fit)
})
onBeforeUnmount(() => window.removeEventListener('resize', fit))
</script>

<template>
  <main v-if="item" class="container item">
    <a href="/#archive" class="eyebrow back" @click.prevent="goTo('archive')">← Archive</a>

    <!-- 好几段上下排：ROLE 在最上面，每段 标题 → 链接 → 介绍 → 视频 -->
    <template v-if="item.parts">
      <p v-if="item.role" class="meta">ROLE — {{ item.role }}</p>
      <section v-for="(part, i) in item.parts" :key="part.title" class="part">
        <h2 class="title">{{ part.title }}<template v-if="part.year">, {{ part.year }}</template><template v-if="placeOf(part.year, part.place)">, {{ placeOf(part.year, part.place) }}</template></h2>
        <ul v-if="part.links?.length" class="links">
          <li v-for="link in part.links" :key="link.href">
            <a :href="link.href" target="_blank" rel="noopener">{{ link.label }} ↗</a>
          </li>
        </ul>
        <p v-if="part.text" class="text">{{ part.text }}</p>
        <!-- 第一段的视频放进第一屏；后面的视频和第一个一样宽 -->
        <MediaViewer
          :ref="i === 0 ? 'viewer' : undefined"
          class="viewer"
          :media="part.media"
          :title="part.title"
          :autoplay="i === 0"
          :style="fitHeight ? { '--fit-h': `${fitHeight}px` } : undefined"
        />
      </section>
    </template>

    <template v-else>
    <!-- 顺序：ROLE → 标题, 年份 → 介绍 → 链接 → 图片 / 视频 / 嵌入的网站 -->
    <p v-if="item.role" class="meta role">ROLE — {{ item.role }}</p>
    <!-- 好几部作品：每部一行英文标题, 年份，下面一行中文 -->
    <h1 v-if="item.works" class="works">
      <span v-for="w in item.works" :key="w.title" class="work">
        <span class="title">{{ w.title }}<template v-if="w.year">, {{ w.year }}</template><template v-if="placeOf(w.year, w.place)">, {{ placeOf(w.year, w.place) }}</template></span>
        <span v-if="w.titleZh" class="title title-zh">{{ w.titleZh }}</span>
      </span>
    </h1>
    <h1 v-else class="title">{{ item.title }}<template v-if="item.year">, {{ item.year }}</template><template v-if="placeOf(item.year, item.place)">, {{ placeOf(item.year, item.place) }}</template></h1>
    <p v-if="item.titleZh" class="title title-zh">{{ item.titleZh }}</p>
    <p v-if="item.meta" class="meta">{{ item.meta }}</p>

    <!-- 用 CSS order 调换 介绍 和 链接 的先后：linksFirst 时链接在上 -->
    <div class="body" :class="{ 'links-first': item.linksFirst }">
      <p v-if="item.text" class="text">{{ item.text }}</p>
      <p v-if="item.textZh" class="text text-zh">{{ item.textZh }}</p>

      <ul v-if="item.links?.length" class="links">
        <li v-for="link in item.links" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener">{{ link.label }} ↗</a>
        </li>
      </ul>
    </div>

    <!-- 左右两个窗口：左边照片（默认 4:3，海报 2:3），右边视频（16:9），两边一样高 -->
    <div
      v-if="item.mediaRight"
      ref="viewer"
      class="viewer split"
      :class="{ fill: item.leftRatio }"
      :style="{ '--left-r': item.leftRatio ?? 4 / 3, ...(fitHeight ? { '--fit-h': `${fitHeight}px` } : {}) }"
    >
      <MediaViewer class="left" :media="item.media" :title="item.title" :ratio="String(item.leftRatio ?? 4 / 3)" />
      <MediaViewer class="right" :media="item.mediaRight" :title="item.title" />
    </div>
    <MediaViewer
      v-else
      ref="viewer"
      class="viewer"
      :media="item.media"
      :title="item.title"
      :style="fitHeight ? { '--fit-h': `${fitHeight}px` } : undefined"
    />
    </template>
  </main>
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
}

.links-first .links {
  order: -1;
}

.item {
  max-width: 1280px;
  padding-top: 100px;
  padding-bottom: 60px;
}

.back {
  display: inline-block;
  margin-bottom: 32px;
  transition: color 0.3s;
}

.back:hover {
  color: var(--fg);
}

.title {
  margin: 0 0 12px;
  font-size: clamp(18px, 1.4vw, 22px); /* 小标题，一进来就能看到下面的作品 */
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.01em;
}

.works {
  margin: 0 0 12px;
  font: inherit;
}

.work {
  display: block;
}

.work + .work {
  margin-top: 14px;
}

.work .title {
  display: block;
  margin: 0;
}

.work .title-zh {
  margin-top: 6px;
}

.title-zh {
  margin-top: -4px; /* 紧跟在英文标题下面 */
}

.text-zh {
  margin-top: 8px;
}

.meta {
  margin: 0 0 6px;
  font-size: var(--small);
  letter-spacing: 0.08em;
  color: var(--muted);
}

/* 最上面的 ROLE 和下面的标题隔开一点 */
.role {
  margin-bottom: 14px;
}

.viewer {
  margin-top: 28px;
}

/* 好几段上下排：每段之间留一大段空，后面的视频最多一屏高 */
.part {
  margin-top: 28px;
}

.part + .part {
  margin-top: 120px;
}

.part .title {
  margin-bottom: 0;
}

.part .viewer {
  --fit-h: calc(100vh - 220px);
}

/* 电脑：宽度按 16:9 跟着可用高度走，保证整个在这一屏里 */
@media (min-width: 900px) {
  .viewer {
    max-width: calc(var(--fit-h, 100vh) * 16 / 9);
  }

  /* 画框下面有小字时，给小字留出一行的高度 */
  .viewer:has(.caption) {
    max-width: calc((var(--fit-h, 100vh) - 32px) * 16 / 9);
  }

  /* 两个窗口的宽度按比例分（左边 --left-r 和 16:9），高度就一样 */
  .viewer.split {
    --split-gap: 16px;
    display: flex;
    align-items: flex-start;
    gap: var(--split-gap);
    max-width: calc(var(--fit-h, 100vh) * (var(--left-r) + 16 / 9) + var(--split-gap));
  }

  .viewer.split:has(.caption) {
    max-width: calc((var(--fit-h, 100vh) - 32px) * (var(--left-r) + 16 / 9) + var(--split-gap));
  }

  /* 海报（设了 leftRatio）填满画框，不留黑边，上下边和右边视频对齐 */
  .split.fill .left :deep(.stage img) {
    object-fit: cover;
  }

  .viewer.split.fill {
    --split-gap: 40px; /* 海报和视频之间空一点 */
  }

  .split .left,
  .split .right {
    min-width: 0; /* 大图片不会把窗口撑宽 */
  }

  .split .left {
    flex: var(--left-r) 0 0;
  }

  .split .right {
    flex: 1.7778 0 0;
  }
}

/* 手机：上下排 */
@media (max-width: 899px) {
  .split .right {
    margin-top: 12px;
  }
}

.text {
  max-width: 600px;
  white-space: pre-line; /* 介绍里写 \n 就换行 */
  margin: 16px 0 0;
  font-size: var(--small);
  line-height: 1.7;
}

.links {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
}

.links li + li {
  margin-top: 12px;
}

.links a {
  font-size: var(--small);
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--line);
  padding-bottom: 4px;
}
</style>
