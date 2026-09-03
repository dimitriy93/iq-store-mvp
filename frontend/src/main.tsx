import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import {routes} from "./app/router/main.routes.tsx";
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={routes}/>
  </StrictMode>,
)