import spotifyApi from "../../services/spotify-api.js";

export async function ensureAuthenticated(request, reply) {
  if (!spotifyApi.defaults.headers.common.Authorization) {
    return reply.status(401).send({
      message: "Authentication required"
    })
  }
}
