import { createBrowserRouter } from 'react-router-dom'
import { Player } from './pages/player.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Player />,
  },
])
