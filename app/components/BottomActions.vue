<script setup lang="ts">
// 首页和第二页底部的一排：ARCHIVE ↓ · SCROLL ↓ · ABOUT ME →
// hintOpacity：SCROLL 提示的透明度（首页往下滚时淡出）
withDefaults(defineProps<{ hintOpacity?: number }>(), { hintOpacity: 1 })

const { goTo } = useAnchor()

// 点 SCROLL：平滑往下一屏
const scrollDown = () => window.scrollBy({ top: innerHeight, behavior: 'smooth' })
</script>

<template>
  <div class="actions">
    <a href="/#archive" class="btn-frame" @click.prevent="goTo('archive')">Archive ↓</a>
    <a href="/#about" class="btn-frame" @click.prevent="goTo('about')">About me →</a>
    <!-- 和两个按钮同一高度，文字慢慢变亮变暗 -->
    <button
      class="scroll-hint"
      :style="{ opacity: hintOpacity, pointerEvents: hintOpacity > 0 ? 'auto' : 'none' }"
      aria-label="Scroll down"
      @click="scrollDown"
    >
      <span class="breathe">SCROLL ↓</span>
    </button>
  </div>
</template>

<style scoped>
.actions {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

/* 按钮：不要框，只有文字，和 MENU ↗ 一样；左右边缘和上面的文字对齐 */
.btn-frame {
  padding: 11px 0;
  border: none;
  color: var(--fg-2);
  transition: color 0.3s;
}

.btn-frame:hover {
  background: none;
  color: var(--fg);
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

@media (max-width: 899px) {
  .btn-frame {
    padding: 12px 0;
    font-size: 12px;
  }

  .scroll-hint {
    font-size: 12px;
  }
}
</style>
