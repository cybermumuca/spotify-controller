import { api } from '../libs/axios.ts'

export type PlayerState = {
  device: {
    id?: string
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: string
    volume_percent?: number
    supports_volume: boolean
  }
  repeat_state: 'off' | 'context' | 'track'
  shuffle_state: boolean
  smart_shuffle: boolean
  progress_ms: number
  is_playing: boolean
  currently_playing_type: 'track' | 'episode'
  item: {
    id: string
    name: string
    explicit: boolean
    duration_ms: number
    popularity: number
    album: {
      id: string
      album_type: 'album' | 'single' | 'compilation'
      name: string
      images: {
        url: string
        width: number
        height: number
      }[]
      duration_ms: number
    }
    artists: {
      id: string
      name: string
      type: 'artist'
    }[]
  }
}

export async function getPlayerState(): Promise<PlayerState> {
  const response = await api.get<PlayerState>('/player')

  return response.data
}
