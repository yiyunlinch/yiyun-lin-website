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

    <h1 class="title">{{ item.title }}</h1>
    <p v-if="item.meta" class="meta">{{ item.meta }}</p>
    <p v-if="item.role" class="meta">ROLE — {{ item.role }}</p>

    <MediaViewer class="viewer" :media="item.media" :title="item.title" />

    <p v-if="item.text" class="text">{{ item.text }}</p>

    <ul v-if="item.links?.length" class="links">
      <li v-for="link in item.links" :key="link.href">
        <a :href="link.href" target="_blank" rel="noopener">{{ link.label }} →</a>
      </li>
    </ul>
  </main>
</template>

<style scoped>
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
  margin: 0 0 24px;
  font-size: clamp(40px, 7vw, 110px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.01em;
}

.meta {
  margin: 0 0 6px;
  font-size: 15px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.viewer {
  margin-top: 8vh;
}

.text {
  max-width: 680px;
  margin: 8vh 0 0;
  font-size: clamp(17px, 1.35vw, 21px);
  font-weight: 300;
  line-height: 1.65;
}

.links {
  list-style: none;
  margin: 6vh 0 0;
  padding: 0;
}

.links a {
  font-size: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
  padding-bottom: 4px;
}
</style>
