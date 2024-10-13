import spotifyApi from "../../../services/spotify-api.js";

export async function seekSong(request, reply) {
  try {
    await spotifyApi.put("/v1/me/player/volume", {
      params: {
        volume_percent: request.body.volume,
        device_id: request.body.deviceId
      }
    })
    reply.send({message: "Song seeked"})
  } catch (error) {
    console.error(error)

    return reply.status(500).send({error: "Error seeking song"})
  }
}
