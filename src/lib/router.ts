import {
  NotFoundRoute,
  redirect,
  rootRouteWithContext,
  Route,
  Router,
} from '@tanstack/react-router';
import { App } from '~/App';
import { NotFound } from '~/pages/404';
import { Match } from '~/pages/match';
import { Search } from '~/pages/search';
import { SignIn } from '~/pages/sign-in';
import { z } from 'zod';

import { dogSearchSchema } from './fetch-client';
import { User, useWoofinderStore } from './store';

const rootRoute = rootRouteWithContext<{ user?: User }>()({
  component: App,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFound,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SignIn,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/search' });
    }
  },
});

export const searchRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: Search,
  validateSearch: dogSearchSchema,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/' });
    }
  },
});

export const matchRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/match',
  component: Match,
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/' });
    }
  },
});

const { user } = useWoofinderStore.getState();
const routeTree = rootRoute.addChildren([indexRoute, searchRoute, matchRoute]);
export const router = new Router({ routeTree, notFoundRoute, context: { user } });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
