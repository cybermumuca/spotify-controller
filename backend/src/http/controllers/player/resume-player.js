import spotifyApi from "../../../services/spotify-api.js";

export async function resumePlayer(request, reply) {
  try {
    await spotifyApi.put('/v1/me/player/play', {
      params: {
        device_id: request.body.device_id,
      }
    })

    reply.send({message: "Player resumed"})
  } catch (error) {
    console.log(error)

    return reply.status(500).send({
      message: error.message,
    })
  }
}
