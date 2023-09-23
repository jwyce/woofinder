import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { RouterProvider } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { ThemeProvider } from './components/theme-provider';
import { useWoofinderStore } from './lib/store';
import { router } from './routes';

function App() {
  const setUser = useWoofinderStore((state) => state.setUser);
  const clearFavorites = useWoofinderStore((state) => state.clearFavorites);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        onError: (err) => {
          const error = err as AxiosError;
          if (error.response?.status === 401) {
            setUser(undefined);
            clearFavorites();
          }

          toast.error(error.message);
        },
      },
    },
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="woofinder-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
