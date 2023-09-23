import { createBrowserRouter } from 'react-router-dom';

import { NotFound } from './pages/404';
import { Match } from './pages/match';
import { Search } from './pages/search';
import { SignIn } from './pages/sign-in';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
    errorElement: <NotFound />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/match',
    element: <Match />,
  },
]);
