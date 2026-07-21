/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.kret-manufaktur.de',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  // /admin ist nicht öffentlich. Die Produktseiten stammen aus der Datenbank und
  // werden zur Laufzeit unter /katalog-sitemap.xml ausgeliefert – eine zur Bauzeit
  // erzeugte Liste wäre nach der ersten Pflege in der Verwaltung veraltet.
  exclude: ['/agb', '/datenschutz', '/impressum', '/admin', '/admin/*', '/katalog/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/admin/'] },
    ],
    additionalSitemaps: ['https://www.kret-manufaktur.de/katalog-sitemap.xml'],
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/katalog': 0.9,
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
