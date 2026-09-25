// 页面里用 data-anchor="archive" 这样的标记作为跳转目标。
// 电脑版和手机版的 Archive 位置不一样，所以同一个名字可能有两个标记，
// 这里只找当前看得见的那个（display:none 的元素 offsetParent 为 null）。
export function findAnchor(name: string): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>(`[data-anchor="${name}"]`)
  return Array.from(els).find(el => el.offsetParent !== null) ?? null
}

export function useAnchor() {
  const route = useRoute()

  function goTo(name: string) {
    if (route.path === '/') {
      if (name === 'home') {
        window.scrollTo({ top: 0 })
      }
      else {
        findAnchor(name)?.scrollIntoView()
      }
      history.replaceState(history.state, '', name === 'home' ? '/' : `/#${name}`)
    }
    else {
      // 在作品页：先回首页，router.options.ts 负责滚到对应位置
      navigateTo(name === 'home' ? '/' : { path: '/', hash: `#${name}` })
    }
  }

  return { goTo }
}
