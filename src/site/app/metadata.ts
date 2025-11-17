import type { SiteMetadata } from '../../types/app.types.js';

const metadata: SiteMetadata = {
    title: 'The Plug Afrique | Strategic Consulting for Impact in Africa',
    description: 'The Plug Afrique is a Pan-African consulting practice. We connect people, ideas, and opportunities to bridge strategy and execution for measurable impact.',
    keywords: ['consulting', 'Africa', 'strategy', 'impact'],
    twitterHandle: '@theplugafrique',
    og: {
        type: 'website',
        url: 'https://www.theplugafrique.com/',
        title: 'The Plug Afrique | Connecting Vision and Impact',
        description: 'A Pan-African consulting practice bridging gaps between strategy and execution to create meaningful, measurable impact.',
        image: 'https://www.theplugafrique.com/images/og-preview-image.jpg',
    },
    twitter: {
        card: 'summary_large_image',
        url: 'https://www.theplugafrique.com/',
        title: 'The Plug Afrique | Strategic Consulting for Impact in Africa',
        description: 'We connect the dots that move Africa forward. Explore our strategy, innovation, and partnership services.',
        image: 'https://www.theplugafrique.com/images/twitter-preview-image.jpg',
    },
};

export default metadata;