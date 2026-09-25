// v-reveal：元素滑进屏幕时加上 is-visible，CSS 负责淡入效果
// 用 data-reveal 属性而不是 class：服务器渲染多出的 class 会让 Vue 报 hydration mismatch
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  function getObserver() {
    observer ??= new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer!.unobserve(entry.target) // 只淡入一次
        }
      }
    }, { rootMargin: '0px 0px -10% 0px' })
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    // 服务器渲染时就带上 data-reveal，否则页面会先显示再消失，闪一下
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el: HTMLElement) {
      el.dataset.reveal = ''
      getObserver().observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
