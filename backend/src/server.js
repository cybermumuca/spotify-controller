import 'dotenv/config';
import {app} from "./app.js";
import {initializeSpotifyApi} from "./services/spotify-api.js";

await initializeSpotifyApi()

app.listen({
  host: process.env.HOST,
  port: process.env.PORT
}).then((address) => {
  console.log("Servidor rodando em", address);
});
