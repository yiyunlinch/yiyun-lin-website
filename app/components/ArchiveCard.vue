<script setup lang="ts">
import type { ArchiveItem } from '~/data/archive'

const props = withDefaults(defineProps<{
  item: ArchiveItem
  caption?: boolean // 是否显示下面的小字（Film / Theatre …）
  lazy?: boolean
}>(), { caption: true, lazy: true })

// 封面：第一张图片；没有图片就显示占位框
const cover = computed(() => props.item.media.find(m => m.type === 'image'))
</script>

<template>
  <NuxtLink :to="`/archive/${item.slug}`" class="card">
    <div class="frame">
      <img
        v-if="cover"
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

.frame img {
  transition: transform 0.8s ease, opacity 0.4s;
}

.card:hover .frame img {
  transform: scale(1.03);
}

.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #444;
  font-size: 14px;
  letter-spacing: 0.2em;
}

.card-caption {
  margin: 12px 0 0;
  font-size: 15px;
  color: var(--fg);
}
</style>
