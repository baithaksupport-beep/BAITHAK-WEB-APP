import './globals.css';
import { IBM_Plex_Sans_JP } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';

const ibmPlexSansJP = IBM_Plex_Sans_JP({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://baithak-web-app.vercel.app'),
  title: {
    default: 'Baithak - Student Discussion Platform',
    template: '%s | Baithak',
  },
  description: 'A student-centered discussion platform built to create meaningful conversations within educational communities. Connect, ask questions, share ideas, and grow together.',
  keywords: ['Baithak', 'Student Discussion', 'VSSUT', 'Campus Community', 'Peer Learning', 'Academic Queries', 'Colleges', 'Study Material'],
  authors: [{ name: 'Soumya Patnaik' }, { name: 'Sushmit K. Satapathy' }],
  verification: {
    google: 'gNNmciSuuHg4S2Wdhn2Pp8fjN51N5Ny9cxaS2qnQOBU',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Baithak - Student Discussion & Campus Circle',
    description: 'A student-centered discussion platform built to create meaningful conversations within educational communities.',
    url: 'https://baithak-web-app.vercel.app',
    siteName: 'Baithak',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Baithak Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baithak - Student Discussion Platform',
    description: 'A student-centered discussion platform built to create meaningful conversations within educational communities.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ibmPlexSansJP.className}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
