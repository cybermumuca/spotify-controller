import axios from 'axios';
import {getTokens, removeTokens, saveTokens} from "../utils/token-utils.js";
import {AuthError} from "../errors/auth-error.js";

const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com",
  withCredentials: true
});

const failedQueue = [];
let isRefreshing = false;

spotifyApi.interceptors.response.use(
  (config) => config,
  async (requestError) => {
    if (requestError.response?.status === 401) {
      const noTokenProvided = requestError.response.data?.error?.status === 401 && requestError.response.data?.error.message.includes("No token provided");

      if (noTokenProvided) {
        return Promise.reject(new AuthError("Authentication required"));
      }

      if (requestError.response.data?.error?.status === 401) {
        const tokens = await getTokens();

        if (!tokens) {
          await removeTokens();
          return Promise.reject(requestError)
        }

        const originalRequest = requestError.config;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(spotifyApi(originalRequest));
              },
              onFailure: reject,
            });
          });
        }

        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const {data} = await axios.post('https://accounts.spotify.com/api/token', {
              grant_type: 'refresh_token',
              refresh_token: tokens.refresh_token,
            }, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
              }
            });

            await saveTokens({
              refreshToken: data.refresh_token || tokens.refresh_token,
              accessToken: data.access_token
            });

            if (originalRequest.data) {
              originalRequest.data = JSON.parse(originalRequest.data);
            }

            originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;

            spotifyApi.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;

            failedQueue.forEach((request) => {
              request.onSuccess(data.access_token);
            });

            resolve(spotifyApi(originalRequest));
          } catch (error) {
            failedQueue.forEach((request) => {
              request.onFailure(error);
            });
            reject(error)
          } finally {
            isRefreshing = false;
            failedQueue.length = 0;
          }
        })
      }
    }

    return Promise.reject(requestError)
  }
)

export async function initializeSpotifyApi() {
  const tokens = await getTokens();

  if (tokens?.accessToken) {
    spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    console.log("Access Token configurado com sucesso na inicialização!");
  } else {
    console.log("Nenhum token disponível na inicialização.");
  }
}


export default spotifyApi;
