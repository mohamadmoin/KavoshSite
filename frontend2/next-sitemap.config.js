/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://kavoshai.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://kavoshai.com/sitemap.xml',
      'https://kavoshai.com/server-sitemap.xml',
    ],
  },
  // Create a transform function to add lastmod dates and priorities
  transform: async (config, path) => {
    // Custom transformation for blog posts
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Custom transformation for category pages
    if (path.startsWith('/blog/category/')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Custom transformation for tag pages
    if (path.startsWith('/blog/tag/')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default transformation
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    }
  },
} 