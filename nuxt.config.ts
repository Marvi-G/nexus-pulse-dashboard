// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  runtimeConfig: {
    public: {
      appName: 'Nexus Pulse',
    },
  },

  app: {
    head: {
      title: 'Nexus Pulse - Modern Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'A modern, responsive dashboard built with Nuxt 3' },
      ],
    },
  },

  compatibilityDate: '2026-02-05'
});