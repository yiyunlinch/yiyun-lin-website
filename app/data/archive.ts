// Archive 的全部内容都在这里。
// 加新作品：在 items 里加一条；有了图片就放进 public/photo/，再写进 media。
// media 为空时，网站会显示灰色占位框。

export type CategoryKey = 'stories' | 'interactions' | 'objects' | 'explorations'

export interface Media {
  type: 'image' | 'video'
  src: string
  alt?: string
}

export interface ArchiveItem {
  slug: string // 网址里的名字：/archive/<slug>
  number: string // 素材编号 02–15
  category: CategoryKey
  label: string // Archive 格子下面的小字
  title: string
  meta?: string // 例如 "Film Production · Shanghai · 2019"
  role?: string // 例如 "Producer"
  text?: string // 简短介绍
  media: Media[]
  links?: { label: string, href: string }[]
}

export const categories: { key: CategoryKey, title: string }[] = [
  { key: 'stories', title: 'STORIES' },
  { key: 'interactions', title: 'INTERACTIONS' },
  { key: 'objects', title: 'OBJECTS' },
  { key: 'explorations', title: 'EXPLORATIONS' },
]

export const items: ArchiveItem[] = [
  // ---------- STORIES ----------
  {
    slug: 'shanghai-film',
    number: '02',
    category: 'stories',
    label: 'Film',
    title: 'FILM TITLE', // TODO: 片名
    meta: 'Film Production · Shanghai', // TODO: 加年份
    role: 'Producer',
    text: 'A few words about it.', // TODO
    media: [{ type: 'image', src: '/photo/02shanghai.jpg', alt: 'Film set in Shanghai' }],
  },
  { slug: 'theatre', number: '06', category: 'stories', label: 'Theatre', title: 'THEATRE', media: [] },
  { slug: 'video-story', number: '07', category: 'stories', label: 'Video Story', title: 'VIDEO STORY', media: [] },
  { slug: 'documentary', number: '08', category: 'stories', label: 'Documentary', title: 'DOCUMENTARY', media: [] },

  // ---------- INTERACTIONS ----------
  {
    slug: 'zahnihero',
    number: '03',
    category: 'interactions',
    label: 'Interactive',
    title: 'ZAHNIHERO', // TODO: 确认标题
    meta: 'Physical Computing', // TODO
    text: 'A few words about it.', // TODO
    media: [{ type: 'image', src: '/photo/03computer.jpg', alt: 'Toothbrush connected to a laptop' }],
  },
  { slug: 'interactive', number: '09', category: 'interactions', label: 'Interactive', title: 'INTERACTIVE', media: [] },
  { slug: 'ai-experiment', number: '10', category: 'interactions', label: 'AI Experiment', title: 'AI EXPERIMENT', media: [] },

  // ---------- OBJECTS ----------
  {
    slug: 'simpsons-tv',
    number: '04',
    category: 'objects',
    label: 'Handmade',
    title: 'THE SIMPSONS TV', // TODO: 确认标题
    meta: 'Handmade Object',
    text: 'A few words about it.', // TODO
    media: [{ type: 'image', src: '/photo/04-web.jpg', alt: 'Handmade cardboard TV with Simpsons figures' }],
  },
  { slug: 'book-print', number: '11', category: 'objects', label: 'Book / Print', title: 'BOOK / PRINT', media: [] },
  { slug: 'object', number: '12', category: 'objects', label: 'Object', title: 'OBJECT', media: [] },

  // ---------- EXPLORATIONS ----------
  {
    slug: 'exploration',
    number: '05',
    category: 'explorations',
    label: 'Exploration',
    title: 'EXPLORATION', // TODO
    meta: 'Life Exploration',
    text: 'A few words about it.', // TODO
    media: [{ type: 'image', src: '/photo/05explore.jpg', alt: 'Two people talking under blue light' }],
  },
  { slug: 'yoga', number: '13', category: 'explorations', label: 'Yoga', title: 'YOGA', media: [] },
  { slug: 'research', number: '14', category: 'explorations', label: 'Research', title: 'RESEARCH', media: [] },
  { slug: 'life-experiment', number: '15', category: 'explorations', label: 'Life / Experiment', title: 'LIFE / EXPERIMENT', media: [] },
]

// 滚动动画用的四张图：02 03 04 05
export const firstFrames = ['02', '03', '04', '05'].map(n => items.find(i => i.number === n)!)

export function itemsIn(category: CategoryKey) {
  return items.filter(i => i.category === category)
}
