import { useEffect, useState } from 'react'
import { getPlayerState, PlayerState } from '../api/getPlayerState.ts'

export function Player() {
  const [playerState, setPlayerState] = useState<PlayerState | object>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getPlayerState()
      .then(setPlayerState)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    console.log('playerState', playerState)
  }, [playerState])

  return (
    <div className="flex h-screen flex-col items-center justify-between bg-black p-4 text-white">
      <header className="flex w-full items-center justify-center">
        <div className="flex min-h-min w-full flex-col items-center justify-center">
          <p className="block">Tocando do Álbum</p>
          <span>Nova Moda</span>
        </div>
      </header>

      <div></div>
    </div>
  )
}
