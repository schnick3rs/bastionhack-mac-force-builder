// https://nuxt.com/docs/api/configuration/nuxt-config

const metaDescription: string = 'The MACtory allows you to create and organize multiple forces ' +
    'for the MAC Attack tabletop game by Chris McDowall. ' +
    'Create, manage and view your forces online, saved in your local browser storage.';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
      '@nuxt/image',
      '@nuxt/ui',
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
  ],

  pinia: {
    storesDirs: ['~/stores/**'],
  },

    app: {
        head: {
            title: 'MACtory | A MAC Attack fan page', // default fallback title
            link: [
                { rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/x-icon', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'shortcut icon', type: 'image/x-icon', sizes: '192x192', href: '/android-chrome-192x192.png' },
                { rel: 'shortcut icon', type: 'image/x-icon', sizes: '512x512', href: '/android-chrome-512x512.png' },
            ],
            meta: [

                { name: 'robots', content: 'index,follow' },

                { name: 'description', content: metaDescription },
                { name: 'keywords', content: 'MAC Attack,Boardgame,Tabletop Game,Battle Tech,Mechs,List Builder' },

                /**
                 * Twitter Card, used in Twitter, Discord
                 * @see https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary-card-with-large-image
                 * @see https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary
                 */
                { name: 'twitter:card', content: 'summary_large_image' },
                { property:"twitter:domain", content:"mac-forces-0068b59196af.herokuapp.com" },
                { property:"twitter:url", content:"https://mac-forces-0068b59196af.herokuapp.com/" },
                { name: 'twitter:title', content: 'MACtory | A MAC Attack fan page' },
                { name: 'twitter:description', content: metaDescription },
                { name: 'twitter:image', content: 'https://mac-forces-0068b59196af.herokuapp.com/social_robot_daniel-r_pixabay.png' },
                { name: 'twitter:image:alt', content: 'Image Credit: Daniel R by Pixabay' },

                /**
                 *  Open Graph, used in facebook
                 */
                { name: 'og:site_name', content: 'MACtory' },
                { name: 'og:type', content: 'website' },
                { name: 'og:title', content: 'MACtory | A MAC Attack fan page' },
                { name: 'og:description', content: metaDescription },
                { name: 'og:image', content: 'https://mac-forces-0068b59196af.herokuapp.com/social_robot_daniel-r_pixabay.png' },

            ],
            htmlAttrs: {
                lang: 'en',
            },
        },
    },
})