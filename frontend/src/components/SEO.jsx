import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    const siteTitle = 'RuralReach';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = 'Smart Rural Logistics and Delivery Ecosystem. Bridging the gap in rural connectivity.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content="https://ruralreach-frontend.onrender.com/og-image.png" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
        </Helmet>
    );
};

export default SEO;
