<script setup lang="ts">
import { items } from '~/data/archive'

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
    <h1 class="title">{{ item.title }}<template v-if="item.year">, {{ item.year }}</template></h1>
    <p v-if="item.meta" class="meta">{{ item.meta }}</p>
    <p v-if="item.role" class="meta">ROLE — {{ item.role }}</p>

    <!-- 用 CSS order 调换 介绍 和 链接 的先后：linksFirst 时链接在上 -->
    <div class="body" :class="{ 'links-first': item.linksFirst }">
      <p v-if="item.text" class="text">{{ item.text }}</p>

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

.links a {
  font-size: var(--small);
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--line);
  padding-bottom: 4px;
}
</style>
