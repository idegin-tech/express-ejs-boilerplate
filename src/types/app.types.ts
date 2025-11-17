export type SiteMetadata = {
    title: string;
    description: string;
    keywords?: string[];
    twitterHandle?: string;
    og?: {
        type?: string;
        url?: string;
        title?: string;
        description?: string;
        image?: string;
    };
    twitter?: {
        card?: string;
        url?: string;
        title?: string;
        description?: string;
        image?: string;
    };
};

export type StaticRoute = {
    path: string;
    template: string;
    title: string;
    keywords?: string[];
    description?: string;
    metadata?: Record<string, any>;
    layout?: string;
}
