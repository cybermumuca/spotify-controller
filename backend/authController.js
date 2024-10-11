import {randomUUID} from 'node:crypto';
import querystring from 'node:querystring';
import axios from 'axios';
import spotifyApi from './spotifyApi.js';
import {saveTokens} from './tokenUtils.js';

export async function loginHandler(request, reply) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const responseType = "code";
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const state = randomUUID();
  const scopes = "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing";
  const showDialogAgain = false;

  const spotifyOAuth2LoginURL = new URL('https://accounts.spotify.com/authorize');

  spotifyOAuth2LoginURL.searchParams.append("client_id", clientId);
  spotifyOAuth2LoginURL.searchParams.append("response_type", responseType);
  spotifyOAuth2LoginURL.searchParams.append("redirect_uri", redirectUri);
  spotifyOAuth2LoginURL.searchParams.append("state", state);
  spotifyOAuth2LoginURL.searchParams.append("scope", scopes);
  spotifyOAuth2LoginURL.searchParams.append("show_dialog", String(showDialogAgain));

  reply.redirect(spotifyOAuth2LoginURL.toString());
}

export async function callbackHandler(request, reply) {
  const code = request.query.code || null;
  const state = request.query.state || null;

  if (state === null) {
    return reply.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  try {
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', {
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = authResponse.data.access_token;
    const refreshToken = authResponse.data.refresh_token;

    spotifyApi.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

    await saveTokens({refreshToken, accessToken});

    reply.send({
      message: 'Authenticated successfully',
    });
  } catch (error) {
    console.error('Authentication Error', error);
    reply.status(500).send('Authentication Error');
  }
}
