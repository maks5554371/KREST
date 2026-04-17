/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.kret-manufaktur.de',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/agb', '/datenschutz', '/impressum'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/'] },
    ],
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/wartung': 0.9,
      '/reparatur': 0.9,
      '/beratung': 0.9,
      '/geraete-verkauf': 0.8,
      '/mobiler-service': 0.8,
      '/miete': 0.8,
    }
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
