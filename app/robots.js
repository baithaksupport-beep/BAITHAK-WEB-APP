export default function robots() {
  const baseUrl = 'https://baithak-web-app.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/terms', '/privacy'],
      disallow: ['/dashboard', '/profile-setup', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
