import 'dotenv/config';
import Fastify from 'fastify';
import {callbackHandler, loginHandler} from './authController.js';
import spotifyApi from "./spotifyApi.js";
import cors from '@fastify/cors';
import {getTokens} from "./tokenUtils.js";


const app = Fastify({});

app.register(cors, {
  origin: "*"
});

async function initializeSpotifyApi() {
  const tokens = await getTokens();

  if (tokens?.accessToken) {
    spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    console.log("Access Token configurado com sucesso na inicialização!");
  } else {
    console.log("Nenhum token disponível na inicialização.");
  }
}

app.get('/login', loginHandler);
app.get('/callback', callbackHandler);
app.get("/player",
  async (request, reply) => {
    try {
      const {data} = await spotifyApi.get('/v1/me/player', {
        params: {
          market: 'BR',
        }
      })

      reply.send(data)
    } catch (error) {
      reply.status(500).send(error)
    }
  })

try {
  const port = process.env.PORT || 3000;
  await app.listen({port});
  await initializeSpotifyApi();
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
