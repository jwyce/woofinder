import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import matchFound from '~/assets/match-found.png';
import noMatch from '~/assets/no-match.png';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { fetchApi } from '~/lib/fetch-client';
import { useWoofinderStore } from '~/lib/store';
import { useShouldBeAuthed } from '~/lib/useShouldBeAuthed';
import { Button } from '~/components/ui/button';
import { Loader } from '~/components/ui/loader';
import { DogProfile } from '~/components/dog-profile';
import { Layout } from '~/components/layout';

export function Match() {
  useShouldBeAuthed(true);
  document.title = 'Match | Woofinder';
  const favorites = useWoofinderStore((s) => s.favorites);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['match', favorites],
    queryFn: () => fetchApi.findMatch(favorites),
    enabled: favorites.length > 0,
  });

  const { data: matchedDog } = useQuery({
    queryKey: ['matchedDog', data?.match],
    queryFn: () => fetchApi.getDogs(data ? [data.match] : []),
    enabled: !!data?.match,
  });

  const { data: loc } = useQuery({
    queryKey: ['location', matchedDog],
    queryFn: () => fetchApi.getLocations(matchedDog ? [matchedDog[0].zip_code] : []),
    enabled: !!matchedDog,
  });

  useEffect(() => {
    if (matchedDog && favorites.length > 0) {
      confetti();
    }
  }, [matchedDog, favorites]);

  if (favorites.length === 0) {
    return (
      <Layout className="min-h-0">
        <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <img src={noMatch} alt="no match" className="h-24 w-24 md:h-[10rem] md:w-[10rem]" />
          </div>
          <p className="text-sm text-muted-foreground">
            You haven't favorited any dogs yet! Find a few you like and come back.
          </p>
          <Button onClick={() => navigate('/search')}>Search dogs</Button>
        </div>
      </Layout>
    );
  }

  if (isLoading || !matchedDog)
    return (
      <Layout className="min-h-0">
        <Loader />
      </Layout>
    );

  return (
    <Layout className="min-h-0">
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2">
          <img src={matchFound} alt="match found" className="h-24 w-24 md:h-[10rem] md:w-[10rem]" />
        </div>
        <p className="text-2xl font-bold">We found a match!</p>
        <DogProfile dog={matchedDog[0]} locations={loc} />
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="transition duration-200 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600  lg:flex"
            onClick={async () => {
              await refetch();
            }}
          >
            <Heart className="mr-2 h-4 w-4" />
            Match Again
          </Button>
          <Button onClick={() => navigate('/search')}>Search dogs</Button>
        </div>
      </div>
    </Layout>
  );
}
