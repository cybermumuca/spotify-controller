import {login} from "./login.js";
import {callback} from "./callback.js";

export async function oAuth2Routes(app) {
  app.get("/oauth2", login)
  app.get('/oauth2/callback', callback)
}
