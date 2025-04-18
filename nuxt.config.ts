// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
const { GMAPS_API_KEY,ALGOLIA_API_KEY, ALGOLIA_APPLICATION_ID } = process.env

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {GMAPS_API_KEY, ALGOLIA_API_KEY, ALGOLIA_APPLICATION_ID}
  },
  css: ['/assets/main.css'],
  modules: ['@nuxt/eslint', ['@nuxtjs/algolia',
    {
      apiKey: ALGOLIA_API_KEY,
      applicationId: ALGOLIA_APPLICATION_ID,
    }
  ]],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
})