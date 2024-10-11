import axios from 'axios';
import {getTokens, removeTokens, saveTokens} from "./tokenUtils.js";

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
              }
            });

            await saveTokens({refreshToken: data.refresh_token, accessToken: data.access_token});

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

export default spotifyApi;
