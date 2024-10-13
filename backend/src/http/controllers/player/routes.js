import {getPlayerState} from "./get-player-state.js";
import {ensureAuthenticated} from "../../middlewares/ensure-authenticated.js";
import {pausePlayer} from "./pause-player.js";
import {ensurePremium} from "../../middlewares/ensure-premium.js";
import {resumePlayer} from "./resume-player.js";
import {nextSong} from "./next-song.js";
import {previousSong} from "./previous-song.js";
import {seekSong} from "./seek-song.js";

export async function playerRoutes(app) {
  app.addHook("onRequest", ensureAuthenticated)

  app.get("/player", getPlayerState)

  app.put("/player/pause", ensurePremium, pausePlayer)
  app.put("/player/resume", ensurePremium, resumePlayer)
  app.put("/player/next", ensurePremium, nextSong)
  app.put("/player/previous", ensurePremium, previousSong)
  app.put("/player/seek", ensurePremium, seekSong)
}
