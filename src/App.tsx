import React, { Suspense } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, useRouter } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { toast, Toaster } from 'sonner';

import { ThemeProvider } from './components/theme-provider';
import { Loader } from './components/ui/loader';
import { useWoofinderStore } from './lib/store';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export function App() {
  const setUser = useWoofinderStore((state) => state.setUser);
  const clearFavorites = useWoofinderStore((state) => state.clearFavorites);
  const router = useRouter();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (err) => {
        const error = err as AxiosError;
        if (error.response?.status === 401) {
          setUser(undefined);
          clearFavorites();
          router.update({ context: { user: undefined } });
          router.navigate({ to: '/' });
        }

        toast.error(error.message);
      },
    }),
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="woofinder-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors />
        <ReactQueryDevtools initialIsOpen={false} />
        <Suspense fallback={<Loader />}>
          <TanStackRouterDevtools initialIsOpen={false} />
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
