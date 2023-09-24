import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import { ThemeProvider } from './components/theme-provider';
import { useWoofinderStore } from './lib/store';
import { NotFound } from './pages/404';
import { Match } from './pages/match';
import { Search } from './pages/search';
import { SignIn } from './pages/sign-in';

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
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Routes>
              <Route path="*" Component={NotFound} />
              <Route path="/" Component={SignIn} />
              <Route path="/search" Component={Search} />
              <Route path="/match" Component={Match} />
            </Routes>
          </QueryParamProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
