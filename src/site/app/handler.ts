import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    return {
        data: {
            heading: 'Welcome to EJS Express Boilerplate',
            subHeading: 'A modern Express.js starter with EJS, Bootstrap, and TypeScript.'
        },
        metadata: {
            title: 'Home - EJS Express Boilerplate',
            description: 'A modern Express.js starter template with EJS, Bootstrap, and TypeScript for rapid web development.'
        }
    };
}