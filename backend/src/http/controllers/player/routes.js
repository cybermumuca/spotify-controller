import {getPlayerState} from "./get-player-state.js";
import {ensureAuthenticated} from "../../middlewares/ensure-authenticated.js";

export async function playerRoutes(app) {
  app.addHook("onRequest", ensureAuthenticated)
  
  app.get("/player", getPlayerState)
}
