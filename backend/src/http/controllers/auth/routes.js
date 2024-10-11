import {login} from "./login.js";
import {callback} from "./callback.js";
import {getProfile} from "./get-profile.js";
import {ensureAuthenticated} from "../../middlewares/ensure-authenticated.js";

export async function oAuth2Routes(app) {
  app.get("/oauth2", login)
  app.get('/oauth2/callback', callback)

  app.get("/me", {onRequest: [ensureAuthenticated]}, getProfile)
}
