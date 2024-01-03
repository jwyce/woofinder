import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import './globals.css';

import { RouterProvider } from '@tanstack/react-router';

import { router } from './lib/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
