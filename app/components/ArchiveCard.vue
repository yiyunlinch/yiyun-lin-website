<script setup lang="ts">
import type { ArchiveItem } from '~/data/archive'

const props = withDefaults(defineProps<{
  item: ArchiveItem
  caption?: boolean // 是否显示下面的小字（Film / Theatre …）
  lazy?: boolean
}>(), { caption: true, lazy: true })

// 封面：有 coverVideo 就用动态封面（cover 图当加载前的画面）；有 cover 就用 cover 图；否则用第一个媒体，网站（site）用它的录屏视频；什么都没有就显示占位框
const cover = computed(() => {
  if (props.item.coverVideo) return { type: 'video' as const, src: props.item.coverVideo, poster: props.item.cover }
  if (props.item.cover) return { type: 'image' as const, src: props.item.cover }
  const first = props.item.media[0]
  if (first?.type === 'youtube') return { type: 'image' as const, src: `https://i.ytimg.com/vi/${first.src}/hqdefault.jpg` }
  if (first?.type === 'site') return first.preview ? { ...first, type: 'video', src: first.preview } : undefined
  return first
})
</script>

<template>
  <NuxtLink :to="`/archive/${item.slug}`" class="card" :data-cat="item.category">
    <div class="frame">
      <video
        v-if="cover?.type === 'video'"
        :src="cover.src"
        :poster="cover.poster"
        autoplay
        muted
        loop
        playsinline
      />
      <img
        v-else-if="cover"
        :src="cover.src"
        :alt="cover.alt ?? item.title"
        :loading="lazy ? 'lazy' : 'eager'"
      >
      <span v-else class="placeholder">{{ item.number }}</span>
    </div>
    <p v-if="caption" class="card-caption">{{ item.label }}</p>
  </NuxtLink>
</template>

<style scoped>
.card {
  display: block;
}

.frame img,
.frame video {
  transition: transform 0.8s ease, opacity 0.4s;
}

.card:hover .frame img,
.card:hover .frame video {
  transform: scale(1.03);
}

.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #444;
  font-size: var(--label);
  letter-spacing: 0.2em;
}

/* 卡片文字用这个大类深一点的颜色，鼠标移上去变成标题的浅色 */
.card-caption {
  margin: 12px 0 0;
  font-size: var(--small);
  color: var(--cat-deep, var(--fg));
  transition: color 0.3s;
}

.card:hover .card-caption {
  color: var(--cat-light, var(--fg));
}
</style>
