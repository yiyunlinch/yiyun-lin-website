<script setup lang="ts">
const { goTo } = useAnchor()
const open = ref(false)

const links = [
  { label: 'HOME', anchor: 'home' },
  { label: 'ABOUT ME', anchor: 'about' },
  { label: 'ARCHIVE', anchor: 'archive' },
  { label: 'CONTACT', anchor: 'contact' },
]

function select(anchor: string) {
  open.value = false
  goTo(anchor)
}

// 菜单打开时：禁止背景滚动，按 Esc 关闭
watch(open, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <header class="header">
    <a href="/" class="logo" @click.prevent="select('home')">YIYUN LIN</a>
    <button
      class="dots"
      :aria-expanded="open"
      :aria-label="open ? 'Close menu' : 'Open menu'"
      @click="open = !open"
    >
      {{ open ? '×' : '•••' }}
    </button>
  </header>

  <Transition name="fade">
    <nav v-if="open" class="menu" aria-label="Main">
      <a
        v-for="link in links"
        :key="link.anchor"
        :href="link.anchor === 'home' ? '/' : `/#${link.anchor}`"
        @click.prevent="select(link.anchor)"
      >
        {{ link.label }}
      </a>
    </nav>
  </Transition>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px var(--pad) 40px;
  /* 上深下透明的渐变，内容滑到下面时文字也看得清 */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 55%, transparent);
  pointer-events: none;
}

.logo,
.dots {
  pointer-events: auto;
  font-size: clamp(16px, 1.4vw, 20px);
  font-weight: 500;
  letter-spacing: 0.12em;
}

.dots {
  min-width: 44px;
  min-height: 44px;
  letter-spacing: 0.2em;
  text-align: right;
}

.menu {
  position: fixed;
  inset: 0;
  z-index: 15;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vh;
  padding: 0 var(--pad);
  background: rgba(0, 0, 0, 0.94);
}

.menu a {
  font-size: clamp(40px, 7vw, 96px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0.02em;
  transition: color 0.3s;
}

.menu a:hover {
  color: var(--muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
