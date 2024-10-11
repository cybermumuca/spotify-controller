import {getPlayerState} from "./get-player-state.js";

export async function playerRoutes(app) {
  app.get("/player", getPlayerState)
}
