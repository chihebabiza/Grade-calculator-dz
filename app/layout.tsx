import type { Metadata } from 'next';
import './globals.css';
import JsonLd from '@/components/JsonLd';
import SkipLinks from '@/components/SkipLinks';

export const metadata: Metadata = {
    title: 'Calculateur de Moyenne - Grade Calculator DZ | Calcul de Moyenne Universitaire',
    description:
        'Calculateur de moyenne universitaire gratuit pour étudiants algériens. Calculez facilement votre moyenne générale avec coefficients, notes TD/TP et examens. Outil simple et efficace.',
    keywords: [
        'calculateur moyenne',
        'grade calculator',
        'moyenne universitaire',
        'calcul note',
        'étudiant algérie',
        'coefficient',
        'TD TP examen',
    ],
    authors: [{ name: 'Chiheb Abiza' }],
    creator: 'Chiheb Abiza',
    publisher: 'Chiheb Abiza',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://v0-dynamic-grade-calculator.vercel.app'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Calculateur de Moyenne - Grade Calculator DZ',
        description:
            'Calculateur de moyenne universitaire gratuit pour étudiants algériens. Calculez facilement votre moyenne générale avec coefficients.',
        url: 'https://v0-dynamic-grade-calculator.vercel.app',
        siteName: 'Grade Calculator DZ',
        locale: 'fr_DZ',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Grade Calculator DZ - Calculateur de Moyenne',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur de Moyenne - Grade Calculator DZ',
        description:
            'Calculateur de moyenne universitaire gratuit pour étudiants algériens.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code', // Add your Google Search Console verification
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" dir="ltr">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                <meta name="theme-color" content="#000000" />
                <meta name="color-scheme" content="light dark" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="antialiased">
                <SkipLinks />
                <JsonLd />
                {children}
            </body>
        </html>
    );
}
