// https://nuxt.com/docs/api/configuration/nuxt-config
const { GMAPS_API_KEY} = process.env
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {GMAPS_API_KEY}
  }
})
