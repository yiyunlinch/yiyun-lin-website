<template>
  <main>
    <HeroSection />

    <!-- 电脑版：滚动动画 + 四栏 Archive -->
    <div class="animated-only">
      <FrameSequence />
      <ArchiveRest />
    </div>

    <!-- 手机版：一列 + 淡入 -->
    <div class="simple-only">
      <SequenceSimple />
    </div>

    <AboutSection />
    <ContactFooter />
  </main>
</template>

<style scoped>
/* 宽度 ≥ 900px 且没有开"减少动态效果"时用动画版，否则用简单版 */
@media (max-width: 899px), (prefers-reduced-motion: reduce) {
  .animated-only {
    display: none;
  }
}

@media (min-width: 900px) and (prefers-reduced-motion: no-preference) {
  .simple-only {
    display: none;
  }
}
</style>
