import spotifyApi from "../../../services/spotify-api.js";
import {AuthError} from "../../../errors/auth-error.js";

export async function getPlayerState(request, reply) {
  try {
    const {data} = await spotifyApi.get('/v1/me/player', {
      params: {
        market: 'BR',
      }
    })

    reply.send(data)
  } catch (error) {
    if (error instanceof AuthError) {
      return reply.status(401).send({
        message: error.message,
      })
    }

    console.log(error)

    return reply.status(500).send({
      message: error.message,
    })
  }
}
