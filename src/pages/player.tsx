import { useEffect, useState } from 'react'
import { getPlayerState, PlayerState } from '../api/get-player-state.ts'
import { Helmet } from 'react-helmet-async'
import { CaretDown, DotsThreeVertical, Play, SkipBack, SkipForward } from '@phosphor-icons/react'
import { Monitor, Pause, Repeat, Shuffle, Smartphone, Speaker, SquareAsterisk, Volume1 } from 'lucide-react'

function msToMMSS(ms: number) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  const minutesFormatted = String(minutes).padStart(2, '0')
  const secondsFormatted = String(seconds).padStart(2, '0')

  return `${minutesFormatted}:${secondsFormatted}`
}

export function Player() {
  const [playerState, setPlayerState] = useState<PlayerState>({} as PlayerState)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    getPlayerState()
      .then((state) => {
        setPlayerState(state)
        setIsPlaying(state.is_playing)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    console.log('playerState', playerState)
  }, [playerState])

  if (isLoading) {
    return <div>Loading...</div>
  }

  function handlePlayPause() {
    setIsPlaying((state) => !state)
  }

  return (
    <>
      <Helmet title={playerState.item.name} />
      <div className="flex min-h-screen flex-col items-center justify-between bg-black p-4 text-white">
        {/* Cabeçalho */}
        <header className="flex w-full items-center justify-center p-4">
          <div className="flex flex-1 cursor-pointer items-center justify-start justify-self-start">
            <CaretDown size={32} />
          </div>
          <div className="flex min-h-min flex-1 flex-col items-center justify-center">
            <p className="block">
              Tocando do{' '}
              {playerState.item.album.album_type === 'album'
                ? 'Álbum'
                : playerState.item.album.album_type.charAt(0).toUpperCase() +
                  playerState.item.album.album_type.slice(1)}
            </p>
            <span>{playerState.item.album.name}</span>
          </div>
          <div className="flex flex-1 cursor-pointer items-center justify-end justify-self-end">
            <DotsThreeVertical size={32} />
          </div>
        </header>

        <main className="flex w-full flex-col items-center">
          {/* Cover da música */}
          <section className="flex w-full gap-4 p-8">
            <img src={playerState.item.album.images[1].url} className="rounded" alt="Cover art" />
            <div className="flex flex-col gap-1 self-end">
              <h1 className="text-2xl">{playerState.item.name}</h1>
              <div className="flex items-center gap-1">
                {playerState.item.explicit ? <SquareAsterisk className="h-4 w-4" /> : null}
                <h2 className="text-lg">{playerState.item.artists.map(({ name }) => name).join(', ')}</h2>
              </div>
            </div>
          </section>

          {/* Barra de progresso */}
          <section className="flex w-full items-center gap-4 px-8">
            <span>{msToMMSS(playerState.progress_ms)}</span>
            <div className="relative h-1 w-full rounded bg-gray-light">
              <div
                className="absolute top-0 h-1 rounded bg-green"
                style={{
                  width: `${(playerState.progress_ms / playerState.item.duration_ms) * 100}%`,
                }}
              />
            </div>
            <span>{msToMMSS(playerState.item.duration_ms)}</span>
          </section>

          {/* Controle da mídia */}
          <section className="flex w-full items-center justify-between gap-4 p-4">
            {/* Device */}
            <section className="flex items-center gap-2 ps-4">
              {playerState.device.type === 'Computer' && <Monitor className="h-6 w-6 text-green" />}
              {playerState.device.type === 'Smartphone' && <Smartphone className="h-6 w-6 text-green" />}
              {playerState.device.type === 'Speaker' && <Speaker className="h-6 w-6 text-green" />}
              <p className="text-sm">
                Tocando em <span className="text-green">{playerState.device.name}</span>
              </p>
            </section>

            {/* Controles da musica */}
            <section className="flex items-center justify-center gap-8">
              <Shuffle className="h-6 w-6 cursor-pointer" />
              <SkipBack className="h-6 w-6 cursor-pointer" />
              <button onClick={handlePlayPause} className="rounded-full bg-white p-2 text-black">
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" weight="fill" />}
              </button>
              <SkipForward className="h-6 w-6 cursor-pointer" />
              <Repeat className="h-6 w-6 cursor-pointer" />
            </section>

            {/* Controle de volume */}
            <section className="flex items-center gap-2 pe-4">
              <Volume1 className="h-6 w-6 cursor-pointer" />
              <div className="relative h-1 w-24 rounded bg-gray-light">
                <div className="absolute top-0 h-1 rounded bg-green" style={{ width: '50%' }} />
              </div>
            </section>
          </section>
        </main>
      </div>
    </>
  )
}
