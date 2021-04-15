export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'rooftop-blog',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    { src: '~/assets/css/main.scss', lang: 'scss' },
    // { src: '~/assets/css/animation.scss', lang: 'scss' },
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    { src: '@/plugins/aos', ssr: false, mode: 'client' },
    { src: '@/plugins/api' },
    { src: '@/plugins/vue-mavon-editor', ssr: false },
    '@/plugins/global',
    { src: '@/plugins/localStorage', ssr: false }
    // '@/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // '@nuxtjs/auth-next',
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy'
  ],
  proxy: {
    // see Proxy section
    '/api': {
      target: 'http://localhost:8081/',
      // ws: true,
      changeOrigin: true,
      pathRewrite:{
        "^/api":"",
    }
    }
  },
  styleResources: {
    scss: '~assets/css/main.scss'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    prefix: '/api',
    baseURL: 'http://localhost:8081'
    // baseURL: 'https://mock.yonyoucloud.com/mock/17387'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  router: {
    middleware: [
      // 'authenticated'
      // 'auth',
      //   'no-auth'
    ]
  }
}
