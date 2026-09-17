import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://tutoring.farikaatkins.online'),
  title: {
    template: '%s | The English Language',
    default: 'The English Language | Expert English & Language Arts Tutoring in Jamaica',
  },
  description:
    'Expert English Language & Literature tutoring in Jamaica. Specializing in CSEC English A, CSEC English B (Literature), IGCSE First Language, and IB English preparation with small group classes and one-on-one lessons.',
  keywords: [
    'English tutoring Jamaica',
    'Literature tutoring Jamaica',
    'CSEC English B Literature',
    'CSEC English lessons',
    'CSEC English A tutor',
    'IGCSE English tutor Jamaica',
    'IB English tutor',
    'English extra lessons Kingston',
    'Language Arts tutor Jamaica',
    'CXC English tutoring',
    'CXC Literature exam preparation',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_JM',
    siteName: 'The English Language',
    title: 'The English Language | Expert English & Literature Tutoring in Jamaica',
    description:
      'Expert English & Literature tutoring. CSEC English A & B, IGCSE, IB. Small group classes with exam-focused expertise.',
    url: '/',
    images: [{ url: '/farika.webp', width: 1200, height: 630, alt: 'Farika Atkins, Lead Educator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The English Language | Expert English & Literature Tutoring in Jamaica',
    description:
      'CSEC English A & B, IGCSE, IB English tutoring. Small groups. Exam-focused. Online lessons.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'The English Language',
    description:
      'Expert English Language & Literature tutoring in Jamaica. CSEC English A, CSEC English B (Literature), IGCSE English Language, and IB English preparation.',
    url: process.env.SITE_URL || 'https://theenglishlanguage.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JM',
      addressLocality: 'Kingston',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Jamaica',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'English & Literature Programmes',
      itemListElement: [
        { '@type': 'Course', name: 'CSEC English B (Literature)' },
        { '@type': 'Course', name: 'CSEC English A' },
        { '@type': 'Course', name: 'IGCSE English Language' },
        { '@type': 'Course', name: 'IB English' },
        { '@type': 'Course', name: 'Essay Writing' },
        { '@type': 'Course', name: 'Comprehension Skills' },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans text-slate-900 bg-white antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
