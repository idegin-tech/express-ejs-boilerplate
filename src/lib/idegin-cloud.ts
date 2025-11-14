import axios from 'axios'

export const IDEGIN_CLOUD_API_BASE = process.env.IDEGIN_CLOUD_BASE_URL;

export async function iDeginCloud(route: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    const url = `${IDEGIN_CLOUD_API_BASE}${route}`
    const secretKey = process.env.IDEGIN_CLOUD_SECRET_KEY

    try {
        const response = await axios({
            method,
            url,
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            data: method !== 'GET' ? data : undefined,
            params: method === 'GET' ? data : undefined
        })

        return response.data
    } catch (error) {
        console.error(`iDeginCloud API Error (${method} ${route}):`, error)
        throw error
    }
}
