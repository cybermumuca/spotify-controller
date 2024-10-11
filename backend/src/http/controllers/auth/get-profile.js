import spotifyApi from "../../../services/spotify-api.js";

export async function getProfile(request, reply) {
  try {
    const {data} = await spotifyApi.get("/v1/me")

    return reply.send(data)
  } catch (error) {
    console.log(error)
    return reply.status(500).send({
      message: error.message,
    })
  }
}
