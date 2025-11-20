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
    if (window.location.href.startsWith('http://localhost')) {
        console.log('Running locally, using mock data');
        return mockData;
    }

    console.log('Running on deployed site, attempting to fetch real events...');

    try {
        const token = await getAccessToken();
        if (!token) {
            console.log('No token available, falling back to mock data');
            return mockData;
        }

        const serverlessBaseUrl =
            'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
        const eventsEndpoint = `${serverlessBaseUrl}/api/get-events`;

        console.log('Fetching events with token...');
        const response = await fetch(`${eventsEndpoint}/${token}`);
        const result = await response.json();

        if (result.events && result.events.length > 0) {
            console.log(`Successfully fetched ${result.events.length} events`);
            return result.events;
        } else {
            console.log('No events returned from API, falling back to mock data');
            return mockData;
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        console.log('Falling back to mock data due to error');
        return mockData;
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

    const tokenCheck = accessToken && (await checkToken(accessToken));

    if (!accessToken || tokenCheck.error) {
        localStorage.removeItem('access_token');

        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        const serverlessBaseUrl =
            'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';

        if (!code) {
            try {
                const response = await fetch(`${serverlessBaseUrl}/api/get-auth-url`);
                const result = await response.json();
                const { authUrl } = result;
                window.location.href = authUrl;
                return null;
            } catch (error) {
                console.error('Error getting auth URL:', error);
                return null;
            }
        }

        return await getToken(code);
    }

    return accessToken;
};
