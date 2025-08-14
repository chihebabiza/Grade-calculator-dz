export default function JsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Calculateur de Moyenne - Grade Calculator DZ',
        description:
            'Calculateur de moyenne universitaire gratuit pour étudiants algériens. Calculez facilement votre moyenne générale avec coefficients, notes TD/TP et examens.',
        url: 'https://v0-dynamic-grade-calculator.vercel.app',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        featureList: [
            'Calcul de moyenne avec coefficients',
            'Support TD/TP et examens',
            'Sauvegarde automatique',
            'Interface responsive',
            'Mode sombre/clair',
        ],
        inLanguage: 'fr-DZ',
        audience: {
            '@type': 'Audience',
            audienceType: 'Students',
        },
        provider: {
            '@type': 'Organization',
            name: 'Chiheb Abiza',
        },
        author: {
            '@type': 'Person',
            name: 'Chiheb Abiza',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
