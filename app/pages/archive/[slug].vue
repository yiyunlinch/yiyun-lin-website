<script setup lang="ts">
import { items, placeOf } from '~/data/archive'

const route = useRoute()
const { goTo } = useAnchor()

const item = computed(() => items.find(i => i.slug === route.params.slug))

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

useHead({ title: () => `${item.value?.title} — YIYUN LIN` })
</script>

<template>
  <main v-if="item" class="container item">
    <a href="/#archive" class="eyebrow back" @click.prevent="goTo('archive')">← Archive</a>

    <!-- 顺序：标题, 年份 → 介绍 → 链接 → 图片 / 视频 / 嵌入的网站 -->
    <!-- 好几部作品：每部一行英文标题, 年份，下面一行中文 -->
    <h1 v-if="item.works" class="works">
      <span v-for="w in item.works" :key="w.title" class="work">
        <span class="title">{{ w.title }}<template v-if="w.year">, {{ w.year }}, {{ placeOf(w.year) }}</template></span>
        <span v-if="w.titleZh" class="title title-zh">{{ w.titleZh }}</span>
      </span>
    </h1>
    <h1 v-else class="title">{{ item.title }}<template v-if="item.year">, {{ item.year }}</template><template v-if="placeOf(item.year, item.place)">, {{ placeOf(item.year, item.place) }}</template></h1>
    <p v-if="item.titleZh" class="title title-zh">{{ item.titleZh }}</p>
    <p v-if="item.meta" class="meta">{{ item.meta }}</p>
    <p v-if="item.role" class="meta">ROLE — {{ item.role }}</p>

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

    <MediaViewer class="viewer" :media="item.media" :title="item.title" />
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
  padding-top: 140px;
  padding-bottom: 20vh;
}

.back {
  display: inline-block;
  margin-bottom: 8vh;
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

.viewer {
  margin-top: 6vh;
}

.text {
  max-width: 600px;
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
