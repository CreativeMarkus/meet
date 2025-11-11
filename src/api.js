import mockData from './mock-data';

export const extractLocations = (events) => {
    if (!Array.isArray(events)) return [];
    const extractedLocations = events.map((event) => event.location);
    const locations = [...new Set(extractedLocations)];
    return locations;
};

export const getEvents = async () => {
    if (window.location.href.startsWith('http://localhost')) {
        return mockData;
    }

    const token = await getAccessToken();
    if (!token) return [];

    const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
    const eventsEndpoint = `${serverlessBaseUrl}/api/get-events`;
    const response = await fetch(`${eventsEndpoint}/${token}`);
    const result = await response.json();

    return result.events || [];
};

const checkToken = async (accessToken) => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const result = await response.json();
    return result;
};

const getToken = async (code) => {
    if (!code) return null;
    const encodeCode = encodeURIComponent(code);
    const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
    const tokenEndpoint = serverlessBaseUrl + '/api/token' + '/' + encodeCode;
    const response = await fetch(tokenEndpoint);
    const { access_token } = await response.json();
    access_token && localStorage.setItem('access_token', access_token);

    return access_token;
};

export const getAccessToken = async () => {
    const accessToken = localStorage.getItem('access_token');
    const tokenCheck = accessToken && (await checkToken(accessToken));

    if (!accessToken || tokenCheck.error) {
        await localStorage.removeItem("access_token");
        const searchParams = new URLSearchParams(window.location.search);
        const code = await searchParams.get("code");
        if (!code) {
            const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
            const response = await fetch(`${serverlessBaseUrl}/api/get-auth-url`);
            const result = await response.json();
            const { authUrl } = result;
            return (window.location.href = authUrl);
        }
        return code && getToken(code);
    }
    return accessToken;
};
