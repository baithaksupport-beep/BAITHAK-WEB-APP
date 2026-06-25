export default async function sitemap() {
  const baseUrl = 'https://baithak-web-app.vercel.app';
  
  // Public crawlable routes
  const routes = ['', '/about', '/terms', '/privacy'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
