import spotifyApi from "../../../services/spotify-api.js";

export async function nextSong(request, reply) {
  try {
    await spotifyApi.post('/v1/me/player/next', {
      params: {
        device_id: request.body.device_id,
      }
    })

    reply.send({message: "Song skipped"})
  } catch (error) {
    console.log(error)

    return reply.status(500).send({
      message: error.message,
    })
  }
}
