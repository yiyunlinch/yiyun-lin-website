<script setup lang="ts">
// 电脑版：滚动动画结束后，Archive 剩下的内容（06–15），四栏对齐第一行
import { categories, firstFrames, itemsIn } from '~/data/archive'

const firstSlugs = new Set(firstFrames.map(i => i.slug))
const columns = categories.map(c => itemsIn(c.key).filter(i => !firstSlugs.has(i.slug)))
</script>

<template>
  <section class="container rest">
    <div v-for="(column, i) in columns" :key="i" class="column">
      <ArchiveCard v-for="item in column" :key="item.slug" v-reveal :item="item" />
    </div>
  </section>
</template>

<style scoped>
.rest {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap);
  align-items: start; /* 四栏不需要一样高 */
  padding-bottom: 20vh;
}

.column {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gap) * 2);
}
</style>
