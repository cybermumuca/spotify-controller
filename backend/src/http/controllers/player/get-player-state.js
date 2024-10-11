import spotifyApi from "../../../services/spotify-api.js";

export async function getPlayerState(request, reply) {
  try {
    const {data} = await spotifyApi.get('/v1/me/player', {
      params: {
        market: 'BR',
      }
    })

    reply.send(data)
  } catch (error) {
    reply.status(500).send(error)
  }
}
