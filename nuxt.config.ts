// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  runtimeConfig: {
    public: {
      appName: 'Pulse',
    },
  },

  compatibilityDate: '2025-07-15',
});
