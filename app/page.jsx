import LandingPageClient from "./LandingPageClient";

export const metadata = {
  title: 'Baithak - Ek Aisi Baithak bhi Zaroori hai Mittar ! ',
  description: 'Ask questions, share study resources, and get class updates from seniors who actually know your course syllabus, canteen hacks, and exam patterns. Join your VSSUT campus circle on Baithak.',
  keywords: ['Baithak', 'Student Discussion Circle', 'VSSUT Campus Circle', 'College Study Material', 'Syllabus Guides', 'Seniors Advice'],
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Baithak",
    "url": "https://baithak-web-app.vercel.app",
    "description": "Student-centered discussion platform built to preserve campus memory and share course insights.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://baithak-web-app.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient />
    </>
  );
}
