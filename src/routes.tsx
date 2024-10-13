import { createBrowserRouter } from 'react-router-dom'
import { Player } from './pages/Player.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Player />,
  },
])
