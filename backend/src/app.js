import Fastify from 'fastify';
import cors from '@fastify/cors';
import {oAuth2Routes} from "./http/controllers/auth/routes.js";
import {playerRoutes} from "./http/controllers/player/routes.js";

export const app = Fastify({
  caseSensitive: true
});

app.register(cors, {
  origin: "*"
});

app.register(oAuth2Routes)
app.register(playerRoutes)
