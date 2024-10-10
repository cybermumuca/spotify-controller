import {Helmet, HelmetProvider} from "react-helmet-async";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes.tsx";

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | spotify.controller"/>
      <RouterProvider router={router}/>
    </HelmetProvider>
  )
}
