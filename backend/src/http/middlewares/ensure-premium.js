import spotifyApi from "../../services/spotify-api.js";

export async function ensurePremium(request, reply) {
  const {data} = await spotifyApi.get("/v1/me")

  if (data.product === "free") {
    return reply.status(403).send({
      message: "Premium subscription required."
    })
  }
}
