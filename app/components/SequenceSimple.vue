<script setup lang="ts">
// 手机版（以及设置了"减少动态效果"的电脑）：
// 那句话 → ARCHIVE → 四个大类；点大类，往下展开里面作品的身份（label，例如 Feature Film Line Producer），点了进作品页
import { categories, itemsIn } from '~/data/archive'

// 展开了哪些大类（可以同时展开好几个）
const open = ref(new Set<string>())
function toggle(key: string) {
  const next = new Set(open.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  open.value = next
}
</script>

<template>
  <div class="container simple">
    <p v-reveal class="phrase">Exploring the digital.{{ '\n' }}Feeling the physical.</p>

    <section class="archive" data-anchor="archive">
      <h2 v-reveal class="archive-title">ARCHIVE</h2>

      <div v-for="cat in categories" :key="cat.key" v-reveal class="category" :data-open="open.has(cat.key)" :data-cat="cat.key">
        <button
          class="cat-btn"
          :aria-expanded="open.has(cat.key)"
          :aria-controls="`cat-${cat.key}`"
          @click="toggle(cat.key)"
        >
          <h3 class="cat-title">{{ cat.title }} <span class="tagline">— {{ cat.tagline }}</span></h3>
        </button>

        <!-- 0fr → 1fr：高度从 0 慢慢展开 -->
        <div :id="`cat-${cat.key}`" class="items" :inert="!open.has(cat.key)">
          <ul>
            <li v-for="item in itemsIn(cat.key)" :key="item.slug">
              <NuxtLink :to="`/archive/${item.slug}`" class="item">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.simple {
  max-width: 960px;
}

/* 那句话靠近第一页的下边 */
.phrase {
  margin: 0;
  padding: 6vh 0 12vh;
  font-size: clamp(22px, 6vw, 40px);
  font-weight: 300;
  line-height: 1.3;
  white-space: pre-line; /* 按 \n 换成两行 */
}

.archive {
  padding-bottom: 16vh;
}

.archive-title {
  margin: 0 0 6vh;
  font-size: clamp(48px, 15vw, 120px);
  font-weight: 500;
  line-height: 1;
}

.category {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.category:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.cat-btn {
  display: block;
  width: 100%;
  padding: 22px 0;
  text-align: left;
}

/* 箭头：收起时向下，展开时向上 */
.cat-title::after {
  transition: transform 0.3s;
}

/* 用 data-open 不用 class：改 class 会把 v-reveal 加的 is-visible 冲掉，整块又变透明 */
[data-open='true'] .cat-title::after {
  transform: rotate(180deg);
}

.items {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}

[data-open='true'] .items {
  grid-template-rows: 1fr;
}

.items ul {
  overflow: hidden;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: block;
  padding: 10px 0 10px 16px;
  font-size: var(--small);
  color: var(--cat-deep);
}

.items li:last-child .item {
  padding-bottom: 26px;
}
</style>
