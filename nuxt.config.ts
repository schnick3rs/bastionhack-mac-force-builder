// https://nuxt.com/docs/api/configuration/nuxt-config
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
            title: 'MAC Attack Force Builder', // default fallback title
            meta: [
                { name: 'description', content: 'Build and manage your MAC force lists' },

                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'MAC Attack Force Builder' },
                { name: 'twitter:description', content: 'Build and manage your MAC force lists' },
                { name: 'twitter:image', content: 'https://mac-forces-0068b59196af.herokuapp.com/social.webp' },

                { name: 'og:site_name', content: 'MAC Attack Force Builder' },
                { name: 'og:type', content: 'website' },
                { name: 'og:title', content: 'MAC Attack Force Builder' },
                { name: 'og:description', content: 'Build and manage your MAC force lists' },
                { name: 'og:image', content: 'https://mac-forces-0068b59196af.herokuapp.com/social.webp' },

            ],
            htmlAttrs: {
                lang: 'en',
            },
        },
    },
})