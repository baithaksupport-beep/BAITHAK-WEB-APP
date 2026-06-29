export default function robots() {
  const baseUrl = 'https://baithakpe.com';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/terms', '/privacy'],
      disallow: ['/dashboard', '/profile-setup', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
