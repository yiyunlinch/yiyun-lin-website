<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section class="container about" data-anchor="about">
    <p v-reveal class="eyebrow">About me</p>
    <h2 v-reveal class="name">{{ site.name }}</h2>

    <img v-reveal class="photo" src="/photo/99dance.JPG" alt="Yiyun Lin dancing in a field" loading="lazy">

    <div class="copy">
      <p v-for="(paragraph, i) in site.about" :key="i" v-reveal>{{ paragraph }}</p>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding-top: 16vh;
  padding-bottom: 16vh;
}

.name {
  margin: 16px 0 8vh;
  font-size: var(--display);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.02em;
}

.photo {
  width: 100%;
  max-width: 1100px;
}

.copy {
  max-width: 680px;
  margin: 8vh 0 0 auto; /* 电脑上文字靠右，和图片错开 */
}

.copy p {
  margin: 0 0 1.4em;
  font-size: clamp(17px, 1.35vw, 21px);
  font-weight: 300;
  line-height: 1.65;
}

@media (max-width: 899px) {
  .copy {
    margin-left: 0;
  }
}
</style>
