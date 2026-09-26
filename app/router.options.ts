import type { RouterConfig } from 'nuxt/schema'

// 换页时的滚动位置：
// - 浏览器后退：回到原来的位置
// - 网址带 #archive 这样的锚点：滚到对应位置
// - 其他：回到页面顶部
export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    if (to.path !== from.path) {
      // 等新页面渲染完再滚动（最多等 1 秒，避免卡住）
      const nuxtApp = useNuxtApp()
      await Promise.race([
        new Promise(resolve => nuxtApp.hooks.hookOnce('page:finish', resolve)),
        new Promise(resolve => setTimeout(resolve, 1000)),
      ])
    }

    if (savedPosition) return savedPosition

    if (to.hash) {
      const el = findAnchor(to.hash.slice(1))
      if (el) return { el, behavior: 'instant' }
    }

    return { top: 0, behavior: 'instant' }
  },
}
