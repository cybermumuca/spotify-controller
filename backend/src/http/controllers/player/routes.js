import {getPlayerState} from "./get-player-state.js";
import {ensureAuthenticated} from "../../middlewares/ensure-authenticated.js";
import {pausePlayer} from "./pause-player.js";
import {ensurePremium} from "../../middlewares/ensure-premium.js";

export async function playerRoutes(app) {
  app.addHook("onRequest", ensureAuthenticated)

  app.get("/player", getPlayerState)
  app.put("/player/pause", ensurePremium, pausePlayer)
}
