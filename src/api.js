import mockData from './mock-data';

/**
 * Extract unique event locations.
 */
export const extractLocations = (events) => {
    if (!Array.isArray(events)) return [];
    const extractedLocations = events.map((event) => event.location);
    const locations = [...new Set(extractedLocations)];
    return locations;
};

/**
 * Fetch events from serverless API or local mock data (when running locally).
 */
export const getEvents = async () => {
    // Use mock data when running locally
    if (window.location.href.startsWith('http://localhost')) {
        return mockData;
    }

    const token = await getAccessToken();
    if (!token) return [];

    const serverlessBaseUrl =
        'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
    const eventsEndpoint = `${serverlessBaseUrl}/api/get-events`;

    try {
        const response = await fetch(`${eventsEndpoint}/${token}`);
        const result = await response.json();
        return result.events || [];
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

/**
 * Verify that the access token is valid using Google’s tokeninfo endpoint.
 */
const checkToken = async (accessToken) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        );
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error checking token:', error);
        return { error: 'Token validation failed' };
    }
};

/**
 * Exchange authorization code for access token via serverless endpoint.
 */
const getToken = async (code) => {
    if (!code) return null;

    const encodedCode = encodeURIComponent(code);
    const serverlessBaseUrl =
        'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
    const tokenEndpoint = `${serverlessBaseUrl}/api/token/${encodedCode}`;

    try {
        const response = await fetch(tokenEndpoint);
        const { access_token } = await response.json();

        if (access_token) {
            localStorage.setItem('access_token', access_token);
            return access_token;
        }
        return null;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
};

/**
 * Get or refresh the access token.
 */
export const getAccessToken = async () => {
    const accessToken = localStorage.getItem('access_token');

    // Check if token exists and is valid
    const tokenCheck = accessToken && (await checkToken(accessToken));

    if (!accessToken || tokenCheck.error) {
        localStorage.removeItem('access_token');

        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        const serverlessBaseUrl =
            'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';

        if (!code) {
            // Get Google Auth URL and redirect the user
            try {
                const response = await fetch(`${serverlessBaseUrl}/api/get-auth-url`);
                const result = await response.json();
                const { authUrl } = result;
                window.location.href = authUrl;
                return null; // stop execution until redirect
            } catch (error) {
                console.error('Error getting auth URL:', error);
                return null;
            }
        }

        // Exchange authorization code for access token
        return await getToken(code);
    }

    return accessToken;
};
