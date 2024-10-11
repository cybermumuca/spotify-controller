import {randomUUID} from "node:crypto";

export async function login(request, reply) {
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
