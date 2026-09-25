<script setup lang="ts">
import { site } from '~/data/site'

const { goTo } = useAnchor()
</script>

<template>
  <section class="hero" data-anchor="home">
    <!-- muted + playsinline：浏览器才允许自动播放，iPhone 不会自动全屏 -->
    <video
      class="bg"
      src="/photo/01smoke-web.mp4"
      poster="/photo/01smoke-poster.jpg"
      autoplay
      muted
      loop
      playsinline
      aria-hidden="true"
    />
    <div class="shade" />

    <div class="content container">
      <p class="pairs">
        <span v-for="pair in site.pairs" :key="pair">{{ pair }}</span>
      </p>

      <h1 class="title">BEYOND ONE FRAME.</h1>

      <div class="actions">
        <a href="/#about" class="btn-frame" @click.prevent="goTo('about')">About me →</a>
        <a href="/#archive" class="btn-frame" @click.prevent="goTo('archive')">Archive ↓</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  height: 100svh; /* 手机浏览器地址栏不会挡住底部 */
  overflow: hidden;
}

.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 视频偏亮，加一层暗色让白字看得清 */
.shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.25) 40%, rgba(0, 0, 0, 0.7));
}

.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 120px;
  padding-bottom: 48px;
}

.pairs {
  display: flex;
  gap: clamp(24px, 5vw, 96px);
  margin: 0 0 4vh;
  font-size: clamp(14px, 1.5vw, 22px);
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.title {
  margin: 0;
  font-size: clamp(36px, 8.5vw, 150px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

/* 手机：三组词改成三行 */
@media (max-width: 899px) {
  .pairs {
    flex-direction: column;
    gap: 10px;
  }

  .title {
    font-size: 9vw;
  }

  .actions .btn-frame {
    padding: 12px 14px;
    font-size: 12px;
  }
}
</style>
