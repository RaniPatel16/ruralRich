import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title ? `${title} | RuralReach` : 'RuralReach - Smart Rural Logistics'}</title>
            <meta name="description" content={description || 'Bridging the last mile in rural logistics with smart GPS mapping.'} />
        </Helmet>
    );
};

export default SEO;
