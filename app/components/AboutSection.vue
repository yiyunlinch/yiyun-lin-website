<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section class="container about" data-anchor="about">
    <p v-reveal class="eyebrow">About me</p>

    <img v-reveal class="photo" src="/photo/99dance.JPG" alt="Yiyun Lin dancing in a field" loading="lazy">

    <div class="copy">
      <p v-for="(paragraph, i) in site.about" :key="i" v-reveal>{{ paragraph }}</p>

      <!-- 介绍下面：Antoni Santin 画的我的肖像 -->
      <figure v-reveal class="portrait">
        <img src="/photo/antoni-santin.jpg" alt="Oil portrait of Yiyun Lin standing between stacks of books, by Antoni Santin" loading="lazy">
        <figcaption>Portrait of me, 229 × 117 cm, oil on canvas by Antoni Santin, 2013</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding-top: 16vh;
  padding-bottom: 16vh;
}

.eyebrow {
  margin: 0 0 6vh;
}

.photo {
  width: 100%;
  max-width: 1100px;
}

.copy {
  max-width: 600px;
  margin: 8vh 0 0 auto; /* 电脑上文字靠右，和图片错开 */
}

.copy p {
  margin: 0 0 1.4em;
  font-size: var(--small);
  line-height: 1.7;
}

.portrait {
  margin: 8vh 0 0;
}

.portrait img {
  display: block;
  width: 100%;
  max-width: 360px;
}

.portrait figcaption {
  margin-top: 14px;
  font-size: var(--label);
  line-height: 1.6;
  color: var(--fg-2);
}

@media (max-width: 899px) {
  .copy {
    margin-left: 0;
  }
}
</style>
