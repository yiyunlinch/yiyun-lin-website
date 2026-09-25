// Archive 的全部内容都在这里。
// 加新作品：在 items 里加一条；有了图片就放进 public/photo/，再写进 media。
// media 为空时，网站会显示灰色占位框。

export type CategoryKey = 'stories' | 'interactions' | 'objects' | 'explorations'

export interface Media {
  // site = 嵌入一个网站：电脑上可以直接在页面里浏览，手机上显示 preview 视频
  // youtube = src 写 YouTube 视频的 ID（网址 watch?v= 后面那串）
  type: 'image' | 'video' | 'site' | 'youtube'
  src: string
  alt?: string
  preview?: string // site 用：一段网站滚动的录屏，也当首页封面
  poster?: string // 视频加载前显示的图
}

export interface ArchiveItem {
  slug: string // 网址里的名字：/archive/<slug>
  number: string // 素材编号 02–15
  category: CategoryKey
  label: string // Archive 格子下面的小字
  title: string
  year?: string // 显示在标题后面：TITLE, 2025
  meta?: string // 例如 "Film Production · Shanghai · 2019"
  role?: string // 例如 "Producer"
  text?: string // 简短介绍
  cover?: string // 首页封面图；不写就用 media 里的第一个
  coverVideo?: string // 动态封面（静音循环播放），这时 cover 当加载前显示的图
  media: Media[]
  links?: { label: string, href: string }[]
  linksFirst?: boolean // true = 链接放在介绍文字上面
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
    label: 'Feature Film Line Producer', // STORIES 下面的小字写身份
    title: 'MRS MILLS',
    year: '2018',
    role: 'Shanghai Line Producer',
    cover: '/photo/02shanghai.jpg',
    media: [{ type: 'video', src: '/photo/02-making-of.mp4', poster: '/photo/02shanghai.jpg', alt: 'Making-of in Shanghai' }],
  },
  {
    slug: 'camp-ghulja',
    number: '06',
    category: 'stories',
    label: 'Video Journalist',
    title: 'CAMP ON THE ROAD TO GHULJA',
    year: '2025',
    role: 'Video Journalist',
    text: 'An interview with artist Jan Rothuizen about Camp on the Road to Ghulja, an investigation that mapped a detention camp in Xinjiang without ever setting foot in China.',
    cover: '/photo/06camp-ghulja-poster.jpg',
    coverVideo: '/photo/06camp-ghulja.mp4', // 视频 6:39–7:01，盖掉了字幕
    media: [{ type: 'youtube', src: 'PzBxUmOqhi4', alt: 'Jan Interview: Camp on the road to Ghulja' }],
    links: [{ label: 'www.digezz.ch/jan-rothuizen-interview', href: 'https://www.digezz.ch/jan-rothuizen-interview-camp-on-the-road-to-ghulja-mongolkure/' }],
    linksFirst: true,
  },
  {
    slug: 'meinig-zellt',
    number: '07',
    category: 'stories',
    label: 'Video Journalist',
    title: 'MEINIG ZELLT',
    year: '2025',
    role: 'Video Journalist',
    text: 'Glarus is currently the only canton in Switzerland with a Landsgemeinde where voters can put forward proposals directly.',
    cover: '/photo/07meinig-zellt.jpg',
    media: [{ type: 'youtube', src: 'WNhWY8ijwR8', alt: 'Meinig zellt' }],
    links: [{ label: 'www.digezz.ch/meinig-zellt', href: 'https://www.digezz.ch/meinig-zellt/' }],
    linksFirst: true,
  },
  { slug: 'documentary', number: '08', category: 'stories', label: 'Documentary', title: 'DOCUMENTARY', media: [] },

  // ---------- INTERACTIONS ----------
  {
    slug: 'story-website',
    number: '03',
    category: 'interactions',
    label: 'Website',
    title: 'SCROLLYTELLING WEBSITE',
    year: '2025',
    text: 'An interactive website that brings together illustration, photography and animation to tell the story of the changes right outside my front door.',
    media: [{
      type: 'site',
      src: 'https://story.yiyun.me/',
      preview: '/photo/03story-scroll.mp4',
      poster: '/photo/03story-poster.jpg',
      alt: 'Scrolling through story.yiyun.me',
    }],
    links: [{ label: 'Open story.yiyun.me', href: 'https://story.yiyun.me/' }],
  },
  {
    slug: 'zahnihero',
    number: '16', // 原来的 03，往后移了
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
