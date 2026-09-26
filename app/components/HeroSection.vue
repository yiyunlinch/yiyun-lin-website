<script setup lang="ts">
import { site } from '~/data/site'

const { goTo } = useAnchor()

// 往下滚提示：开始滚动就慢慢淡出
const hintOpacity = ref(1)
const onScroll = () => { hintOpacity.value = Math.max(0, 1 - scrollY / 200) }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
const scrollDown = () => window.scrollTo({ top: innerHeight, behavior: 'smooth' })
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
        <a href="/#archive" class="btn-frame" @click.prevent="goTo('archive')">Archive ↓</a>
        <a href="/#about" class="btn-frame" @click.prevent="goTo('about')">About me →</a>
        <!-- 往下滚提示：和两个按钮同一高度，文字慢慢变亮变暗；点一下平滑往下一屏 -->
        <button
          class="scroll-hint"
          :style="{ opacity: hintOpacity, pointerEvents: hintOpacity > 0 ? 'auto' : 'none' }"
          aria-label="Scroll down"
          @click="scrollDown"
        >
          <span class="breathe">SCROLL ↓</span>
        </button>
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
  gap: 2em; /* 三组之间大约两个全角空格，整体留在左边 60% 以内 */
  max-width: 62%;
  color: var(--fg-2);
  margin: 0 0 4vh;
  font-size: clamp(14px, 1.5vw, 22px);
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.title {
  margin: 24px 0 0; /* 比原来稍微往下 */
  font-size: var(--display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

/* 按钮：不要框，只有文字，和 MENU ↗ 一样；左右边缘和上面的文字对齐 */
.actions .btn-frame {
  padding: 11px 0;
  border: none;
  color: var(--fg-2);
  transition: color 0.3s;
}

.actions .btn-frame:hover {
  background: none;
  color: var(--fg);
}

.actions {
  position: relative;
}

.scroll-hint {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--label);
  letter-spacing: 0.15em;
  color: var(--fg-2);
  white-space: nowrap;
  padding: 11px 0;
  transition: color 0.3s;
}

.scroll-hint:hover {
  color: var(--fg);
}

.breathe {
  display: inline-block;
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

/* 鼠标移上去：不再呼吸，直接亮白 */
.scroll-hint:hover .breathe {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .breathe { animation: none; }
}

/* 手机：三组词改成三行 */
@media (max-width: 899px) {
  .pairs {
    flex-direction: column;
    gap: 10px;
    max-width: none;
  }

  .actions .btn-frame {
    padding: 12px 0;
    font-size: 12px;
  }

  .scroll-hint {
    font-size: 12px;
  }
}
</style>
