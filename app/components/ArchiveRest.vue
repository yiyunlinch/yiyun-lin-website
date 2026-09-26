<script setup lang="ts">
// 电脑版：滚动动画结束后，Archive 剩下的内容（06–15），四栏对齐第一行
import { categories, firstFrames, itemsIn } from '~/data/archive'

const firstSlugs = new Set(firstFrames.map(i => i.slug))
const columns = categories.map(c => itemsIn(c.key).filter(i => !firstSlugs.has(i.slug)))

// 按行排：同一行的四格从同一高度开始，某一格的字有两行也不会把旁边的往下推
const rowCount = Math.max(...columns.map(c => c.length))
const cells = Array.from({ length: rowCount }, (_, r) => columns.map(c => c[r])).flat()
</script>

<template>
  <section class="container rest">
    <template v-for="(item, i) in cells" :key="item?.slug ?? `empty-${i}`">
      <ArchiveCard v-if="item" v-reveal :item="item" />
      <div v-else />
    </template>
  </section>
</template>

<style scoped>
.rest {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap);
  row-gap: calc(var(--gap) * 2);
  align-items: start;
  padding-bottom: 20vh;
}
</style>
