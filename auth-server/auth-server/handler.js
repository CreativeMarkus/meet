/* eslint-env node */
'use strict';

const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.events.readonly'];

module.exports.getAuthURL = async () => {
    const { CLIENT_SECRET, CLIENT_ID } = process.env;
    const redirect_uri = 'https://meet-two-cyan.vercel.app';

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