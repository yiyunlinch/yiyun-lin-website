# YIYUN LIN — Personal Archive

**Live site: [yiyun.me](https://yiyun.me)**

A personal archive of things I've made, explored, learned and lived — film and theatre production in China, video stories, interactive design and personal experiences in Switzerland.

Built with [Nuxt 4](https://nuxt.com) and hosted on GitHub Pages.

## Desktop and phone

The home page has two layouts:

| | Desktop (≥ 900px) | Phone (< 900px) |
|---|---|---|
| Page 2 | Scroll animation: one frame opens into four (`FrameSequence.vue`) | "Exploring the digital. Feeling the physical." near the top, no animation |
| Archive | Four columns, one per category, with cards | Four category rows. Tap one to see each item's role, then tap a role to open the item (`SequenceSimple.vue`) |
| Header | `YIYUN LIN · BACKGROUND SOUND · MENU` in one line | `MENU` on top and `BACKGROUND SOUND` below, on the right |

A desktop with "reduce motion" switched on also gets the phone layout.

## Background sound

The home page plays quiet, looping background sound. The track changes as you scroll (`useSound.ts`):

1. Page 1: fog
2. Archive: music from the Shanghai Fringe Festival video
3. About me: *Hare Ram Hare Krishna Dhun* (kalsstockmedia, Pixabay)

On the first visit the button shows only `BACKGROUND SOUND`. `×` (turn off) and `↗` (turn on) appear once the sound has started. There is no background sound on item pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit content

- Archive items: `app/data/archive.ts`
- About text and links: `app/data/site.ts`
- Images, videos and sound: `public/photo/`

## Deploy

Every push to `main` builds the site (`nuxt generate`) and publishes it to [yiyun.me](https://yiyun.me) through GitHub Actions (`.github/workflows/deploy.yml`).
