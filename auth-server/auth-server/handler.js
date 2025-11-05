/* eslint-env node */
'use strict';

const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.events.readonly'];

const redirect_uri = 'https://meet-two-cyan.vercel.app';

module.exports.getAuthURL = async () => {
    const { CLIENT_SECRET, CLIENT_ID } = process.env;

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: missing CLIENT_ID or CLIENT_SECRET' }),
        };
    }

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirect_uri);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ authUrl }),
    };
};

module.exports.getAccessToken = async (event) => {
    const { CLIENT_SECRET, CLIENT_ID } = process.env;

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: missing CLIENT_ID or CLIENT_SECRET' }),
        };
    }

    const code = event && event.pathParameters && event.pathParameters.code
        ? decodeURIComponent(`${event.pathParameters.code}`)
        : null;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing `code` parameter' }),
        };
    }

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirect_uri);

    return new Promise((resolve, reject) => {
        /**
         * Exchange authorization code for access token with a callback after the exchange.
         * The callback receives (error, response).
         */
        oAuth2Client.getToken(code, (error, response) => {
            if (error) {
                return reject(error);
            }
            return resolve(response);
        });
    })
        .then((results) => {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(results),
            };
        })
        .catch((error) => {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message || error }),
            };
        });
};

module.exports.getCalendarEvents = async (event) => {
    const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;

    if (!CLIENT_ID || !CLIENT_SECRET || !CALENDAR_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: missing CLIENT_ID, CLIENT_SECRET, or CALENDAR_ID' }),
        };
    }

    // Extract access_token from path parameters
    const access_token = event && event.pathParameters && event.pathParameters.access_token
        ? decodeURIComponent(`${event.pathParameters.access_token}`)
        : null;

    if (!access_token) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing `access_token` parameter' }),
        };
    }

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirect_uri);
    // Set only the access_token here; if you have a refresh_token you may set that too
    oAuth2Client.setCredentials({ access_token });

    // Return a promise which will resolve/reject based on the calendar API callback
    return new Promise((resolve, reject) => {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // Example: list upcoming events (you can change params as needed)
        calendar.events.list(
            {
                calendarId: CALENDAR_ID,
                auth: oAuth2Client,
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            },
            (err, resp) => {
                if (err) {
                    return reject(err);
                }
                return resolve(resp);
            }
        );
    })
        .then((results) => {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ events: results.data.items }),
            };
        })
        .catch((error) => {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message || error }),
            };
        });
};
