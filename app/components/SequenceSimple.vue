<script setup lang="ts">
// 手机版（以及设置了"减少动态效果"的电脑）：
// 同样的顺序，排成一列，往下滑时每块淡入
import { categories, firstFrames, itemsIn } from '~/data/archive'

// 02 上面是那句话，03、04、05 没有标题
const titles = ['Exploring the digital.\nFeeling the physical.', '', '', '']
const steps = firstFrames.map((item, i) => ({ title: titles[i], item }))
</script>

<template>
  <div class="container simple">
    <section class="steps">
      <div v-for="(step, i) in steps" :key="step.item.slug" v-reveal class="step">
        <p v-if="step.title" class="step-title" :class="{ phrase: i === 0 }">{{ step.title }}</p>
        <ArchiveCard :item="step.item" :caption="false" />
      </div>
    </section>

    <section class="archive" data-anchor="archive">
      <h2 class="archive-title">ARCHIVE</h2>

      <div v-for="cat in categories" :key="cat.key" class="category">
        <h3 class="eyebrow">{{ cat.title }}</h3>
        <ArchiveCard v-for="item in itemsIn(cat.key)" :key="item.slug" v-reveal :item="item" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.simple {
  max-width: 960px;
}

.steps {
  padding: 16vh 0 10vh;
  display: flex;
  flex-direction: column;
  gap: 14vh;
}

.step-title {
  margin: 0 0 20px;
  font-size: clamp(22px, 6vw, 40px);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.phrase {
  font-weight: 300;
  letter-spacing: 0;
  line-height: 1.3;
  white-space: pre-line; /* 按 \n 换成两行 */
}

.archive {
  padding-bottom: 16vh;
}

.archive-title {
  margin: 0 0 8vh;
  font-size: clamp(48px, 15vw, 120px);
  font-weight: 500;
  line-height: 1;
}

.category {
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-bottom: 12vh;
}

.category h3 {
  margin: 0;
}
</style>
