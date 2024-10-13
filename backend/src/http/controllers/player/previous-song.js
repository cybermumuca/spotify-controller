import spotifyApi from "../../../services/spotify-api.js";

export async function previousSong(request, reply) {
  try {
    await spotifyApi.post('/v1/me/player/previous', {
      params: {
        device_id: request.body.device_id,
      }
    })

    reply.send({message: "Command executed"})
  } catch (error) {
    console.log(error)

    return reply.status(500).send({
      message: error.message,
    })
  }
}
