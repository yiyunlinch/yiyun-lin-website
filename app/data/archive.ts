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
  href?: string // 图片可以点：点了在新窗口打开这个网址
  start?: number // youtube 用：从第几秒开始播放
}

export interface ArchiveItem {
  slug: string // 网址里的名字：/archive/<slug>
  number: string // 素材编号 02–15
  category: CategoryKey
  label: string // Archive 格子下面的小字
  title: string
  year?: string // 显示在标题后面：TITLE, 2025, SWITZERLAND（地点按年份自动加）
  place?: string // 地点不按年份时单独写；写 '' 就不显示地点
  titleZh?: string // 中文标题，显示在英文标题下面
  works?: { title: string, titleZh?: string, year?: string }[] // 一个项目里有好几部作品时，代替大标题一行一行列出来
  meta?: string // 例如 "Film Production · Shanghai · 2019"
  role?: string // 例如 "Producer"
  text?: string // 简短介绍
  textZh?: string // 中文介绍，显示在英文介绍下面
  cover?: string // 首页封面图；不写就用 media 里的第一个
  coverVideo?: string // 动态封面（静音循环播放），这时 cover 当加载前显示的图
  media: Media[]
  mediaRight?: Media[] // 有的话：左边 media（照片，4:3），右边这个（视频，16:9），同样高
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
    place: 'NETHERLANDS', // 在阿姆斯特丹 Jan 的工作室采访
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
  {
    slug: 'one-founder-one-venture',
    number: '08',
    category: 'stories',
    label: 'Social Media Series Creator',
    title: 'ONE FOUNDER, ONE VENTURE – STORIES IN SWITZERLAND',
    titleZh: '一人一公司：瑞士创业故事',
    year: '2026',
    place: '', // 标题里已经有 STORIES IN SWITZERLAND
    role: 'Social Media Series Creator',
    text: 'One Founder, One Venture – Stories in Switzerland is a social media project bringing together in-depth interviews, shorts and storytelling about solo entrepreneurs, independent professionals and one-person businesses in Switzerland.',
    textZh: '《一人一公司：瑞士创业故事》是一个社交媒体项目，汇集了关于瑞士自由职业者、独立专业人士和一人公司的深度访谈、短视频与故事内容。',
    cover: '/photo/08one-founder.jpg',
    // YouTube 频道页面的截图，点了打开频道
    media: [{ type: 'image', src: '/photo/08youtube-channel.jpg', alt: 'YouTube channel: Stories in Switzerland', href: 'https://www.youtube.com/channel/UC8zfK7OKufZ3JLtwS_z9LZA' }],
    links: [{ label: 'www.digezz.ch/one-founder-one-venture', href: 'https://www.digezz.ch/one-founder-one-venture-stories-in-switzerland/' }],
    linksFirst: true,
  },

  // ---------- INTERACTIONS ----------
  {
    slug: 'story-website',
    number: '03',
    category: 'interactions',
    label: 'Designer & Developer',
    title: 'SCROLLYTELLING WEBSITE',
    year: '2025',
    role: 'Designer & Developer',
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
    label: 'Physical Computing Designer',
    title: 'ZAHNIHERO',
    year: '2025',
    role: 'Physical Computing Designer',
    text: 'ZahniHero is an interactive toothbrushing assistant designed specifically for children, to motivate them to brush their teeth for up to 3 minutes. All components were tested, but the final prototype was never fully assembled.',
    cover: '/photo/03computer.jpg',
    media: [{ type: 'image', src: '/photo/16zahnihero.jpg', alt: 'ZahniHero prototype' }], // GitHub README 第一张图
    links: [{ label: 'github.com/yiyunlinch/zahnihero', href: 'https://github.com/yiyunlinch/zahnihero' }],
    linksFirst: true,
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
    label: 'Contemporary Theatre Performer, Workshop Leader',
    title: 'MEAT I · MEAT II · CLEANSING', // 浏览器标签页上的名字；页面上显示下面的 works
    works: [
      { title: 'MEAT I', titleZh: '《肉I》', year: '2017' },
      { title: 'MEAT II: NIAOLYMPICS PART 2', titleZh: '《肉II》“白日夜话：被子下面”', year: '2018' },
      { title: 'CLEANSING: NIAONIAO MORNING CALL', titleZh: '《清洁》“嬲嬲早会”', year: '2018' },
    ],
    role: 'Contemporary Theatre Performer, Workshop Leader',
    cover: '/photo/05explore.jpg',
    media: [{ type: 'youtube', src: 'Efs4PtVbWjc', start: 4, alt: 'MEAT / CLEANSING' }],
  },
  { slug: 'yoga', number: '13', category: 'explorations', label: 'Yoga', title: 'YOGA', media: [] },
  {
    slug: 'snow-camp',
    number: '17',
    category: 'explorations',
    label: 'Snow Cave Digger, Sleeper & Camera',
    title: '-10°C NIGHTS',
    year: '2020',
    role: 'Snow Cave Digger, Sleeper & Camera',
    text: 'In our first New Years after moving to Switzerland, we dug snow caves with friends, slept in an igloo and ran naked through the snow.',
    cover: '/photo/snowcamp/snowcamp2.jpg',
    media: [
      { type: 'image', src: '/photo/snowcamp/snowcamp1.jpg', alt: 'Igloo lit up at night' },
      { type: 'image', src: '/photo/snowcamp/snowcamp2.jpg', alt: 'Cooking in the snow cave' },
      { type: 'image', src: '/photo/snowcamp/snowcamp3.jpg', alt: 'Carrying gear up the mountain' },
      { type: 'image', src: '/photo/snowcamp/snowcamp4.jpg', alt: 'Campfire in the snow' },
      { type: 'image', src: '/photo/snowcamp/snowcamp6.jpg', alt: 'Sleeping inside the snow cave' },
      { type: 'image', src: '/photo/snowcamp/snowcamp7.jpg', alt: 'Inside the snow cave' },
      { type: 'image', src: '/photo/snowcamp/snowcamp8.jpg', alt: 'Digging the snow cave' },
      { type: 'image', src: '/photo/snowcamp/snowcamp9.jpg', alt: 'Dinner in the snow cave' },
      { type: 'image', src: '/photo/snowcamp/snowcamp99.jpg', alt: 'Digging in the snow' },
    ],
    mediaRight: [{ type: 'youtube', src: 'oZ3RcSFZL90', alt: 'Snow Camping New Year 2020' }],
  },
  { slug: 'research', number: '14', category: 'explorations', label: 'Research', title: 'RESEARCH', media: [] },
  { slug: 'life-experiment', number: '15', category: 'explorations', label: 'Life / Experiment', title: 'LIFE / EXPERIMENT', media: [] },
]

// 滚动动画用的四张图：02 03 04 05
export const firstFrames = ['02', '03', '04', '05'].map(n => items.find(i => i.number === n)!)

// 地点跟着年份：2019 年以前在中国，之后在瑞士；item 写了 place 就用 place
export function placeOf(year?: string, place?: string) {
  if (place !== undefined) return place
  if (!year) return ''
  return Number(year) < 2019 ? 'CHINA' : 'SWITZERLAND'
}

export function itemsIn(category: CategoryKey) {
  return items.filter(i => i.category === category)
}
