import querystring from "node:querystring";
import axios from "axios";
import spotifyApi from "../../../services/spotify-api.js";
import {saveTokens} from "../../../utils/token-utils.js";

export async function callback(request, reply) {
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
