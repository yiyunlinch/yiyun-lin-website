<script setup lang="ts">
const { goTo } = useAnchor()
const sound = useSound()
const open = ref(false)

const links = [
  { label: 'HOME', anchor: 'home', arrow: '↑' },
  { label: 'ABOUT', anchor: 'about', arrow: '→' },
  { label: 'ARCHIVE', anchor: 'archive', arrow: '↓' },
  { label: 'CONTACT', anchor: 'contact', arrow: '↓' },
]

// 打开菜单时看现在在哪一部分，那一行亮白
const route = useRoute()
const current = ref('home')
function findCurrent() {
  if (route.path.startsWith('/archive/')) return 'archive'
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) return 'contact'
  let found = 'home'
  for (const name of ['archive', 'about', 'contact']) {
    const el = findAnchor(name)
    if (el && el.getBoundingClientRect().top <= innerHeight * 0.5) found = name
  }
  return found
}

function select(anchor: string) {
  open.value = false
  goTo(anchor)
}

// 菜单打开时：禁止背景滚动，按 Esc 关闭
watch(open, (isOpen) => {
  if (isOpen) current.value = findCurrent()
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
    <div class="right">
      <button
        class="sound-btn"
        :aria-pressed="sound.on.value"
        :aria-label="sound.on.value ? 'Turn sound off' : 'Turn sound on'"
        @click="sound.toggle()"
      >
        SOUND {{ sound.on.value ? '×' : '↗' }}
      </button>
      <button
        class="menu-btn"
        :aria-expanded="open"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        {{ open ? 'CLOSE ×' : 'MENU ↗' }}
      </button>
    </div>
  </header>

  <Transition name="fade">
    <nav v-if="open" class="menu" aria-label="Main">
      <a
        v-for="(link, i) in links"
        :key="link.anchor"
        :href="link.anchor === 'home' ? '/' : `/#${link.anchor}`"
        :class="{ current: link.anchor === current }"
        @click.prevent="select(link.anchor)"
      >
        <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>{{ link.label }} {{ link.arrow }}
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
.right {
  pointer-events: auto;
}

.right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  font-size: var(--logo);
  font-weight: 500;
  letter-spacing: 0.12em;
}

.sound-btn,
.menu-btn {
  min-width: 44px;
  min-height: 44px;
  text-align: right;
  white-space: nowrap;
  /* 和首页 ABOUT ME 按钮的字一样 */
  font-size: var(--label);
  letter-spacing: 0.15em;
  color: var(--fg-2);
  transition: color 0.3s;
}

.sound-btn:hover,
.sound-btn[aria-pressed='true'],
.menu-btn:hover {
  color: var(--fg);
}

.menu {
  position: fixed;
  inset: 0;
  z-index: 15;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 0 var(--pad);
  background: rgba(0, 0, 0, 0.82); /* 还能隐约看到后面的视频 */
}

/* 和首页 中国 × SWITZERLAND 那行一样的字；其余暗，当前 / hover 亮白 */
.menu a {
  align-self: flex-start;
  font-size: clamp(14px, 1.5vw, 22px);
  letter-spacing: 0.12em;
  color: rgba(242, 240, 234, 0.65);
  transition: color 0.3s;
}

.menu .num {
  display: inline-block;
  width: 3.2em;
  color: rgba(242, 240, 234, 0.4);
  transition: color 0.3s;
}

.menu a.current,
.menu a:hover,
.menu a.current .num,
.menu a:hover .num {
  color: var(--fg);
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
