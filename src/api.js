import mockData from './mock-data';

/**
 * Check if user is already authenticated
 */
export const isAuthenticated = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return false;

    try {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        );
        const result = await response.json();
        return !result.error;
    } catch (error) {
        return false;
    }
};

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
 * Fetch events from Google Calendar API - requires OAuth authentication.
 * Users must sign in with their Google account to use the app.
 * Supports offline functionality by caching events in localStorage.
 */
export const getEvents = async () => {
    console.log('Google OAuth authentication required to access calendar events...');

    // Check if user is offline and return cached events
    if (!navigator.onLine) {
        console.log('User is offline, loading cached events from localStorage...');
        const events = localStorage.getItem("lastEvents");
        return events ? JSON.parse(events) : [];
    }

    try {
        const token = await getAccessToken();

        if (!token) {
            console.log('OAuth authentication failed or was cancelled');
            throw new Error('Authentication required to access calendar events');
        }

        console.log('User authenticated successfully, fetching events from Google Calendar...');
        const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
        const eventsEndpoint = `${serverlessBaseUrl}/api/get-events`;

        const response = await fetch(`${eventsEndpoint}/${token}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.events && Array.isArray(result.events) && result.events.length > 0) {
            console.log(`Successfully fetched ${result.events.length} real events from Google Calendar`);
            // Cache the events for offline use
            localStorage.setItem("lastEvents", JSON.stringify(result.events));
            return result.events;
        } else {
            console.log('No events returned from Google Calendar API, using mock data');
            // Cache mock data as fallback
            localStorage.setItem("lastEvents", JSON.stringify(mockData));
            return mockData;
        }
    } catch (error) {
        console.error('Error in OAuth/API flow:', error);
        console.log('Falling back to mock data due to API error');
        // Try to return cached events first, then mock data
        const cachedEvents = localStorage.getItem("lastEvents");
        if (cachedEvents) {
            console.log('Using cached events from localStorage');
            return JSON.parse(cachedEvents);
        }
        // Cache mock data for future offline use
        localStorage.setItem("lastEvents", JSON.stringify(mockData));
        return mockData;
    }
}

/**
 * Verify that the access token is valid using Google's tokeninfo endpoint.
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
    const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
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

        const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';

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
