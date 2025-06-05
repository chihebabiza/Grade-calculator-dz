import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grade Calculator DZ – Calculate Your Academic Grades Instantly',
  description: 'Grade Calculator DZ helps students in Algeria calculate academic averages quickly and accurately for high school or university.',
  keywords: ['grade calculator', 'DZ grade calculator', 'Algerian grade system', 'academic calculator', 'school average calculator'],
  authors: [{ name: 'Chiheb Abiza', url: 'http://chihebabiza.me' }],
  creator: 'Chiheb abiza',
  metadataBase: new URL('https://v0-dynamic-grade-calculator.vercel.app/'),
  openGraph: {
    title: 'Grade Calculator DZ – Academic Average Tool for Algerian Students',
    description: 'Easily calculate your academic grades using the Grade Calculator DZ, tailored for Algerian students.',
    url: 'https://v0-dynamic-grade-calculator.vercel.app/',
    siteName: 'Grade Calculator DZ',
    locale: 'en_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grade Calculator DZ',
    description: 'Fast and reliable grade calculator for students in Algeria.',
    creator: '@your_twitter',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOccupationalProgram",
              "name": "Grade Calculator DZ",
              "description": "Helps Algerian students calculate academic averages efficiently.",
              "educationalLevel": ["High School", "University"],
              "url": "https://yourdomain.com"
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
