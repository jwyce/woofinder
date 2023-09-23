import { useQuery } from '@tanstack/react-query';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { fetchApi } from '~/lib/fetch-client';
import { useShouldBeAuthed } from '~/lib/useShouldBeAuthed';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Loader } from '~/components/ui/loader';
import { MultiSelect } from '~/components/ui/multi-select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { DogProfile } from '~/components/dog-profile';
import { Layout } from '~/components/layout';

export function Search() {
  document.title = 'Search | Woofinder';
  useShouldBeAuthed(true);

  const navigate = useNavigate();

  const { data: breeds, isLoading } = useQuery({
    queryKey: ['dogBreeds'],
    queryFn: fetchApi.getDogBreeds,
  });

  const { data: dogIds } = useQuery({
    queryKey: ['dogIds'],
    queryFn: () =>
      fetchApi.searchDogs({
        queries: {
          size: 24,
          sort: 'breed:asc',
        },
      }),
  });

  const { data: dogs } = useQuery({
    queryKey: ['dogs'],
    queryFn: () => fetchApi.getDogs(dogIds?.resultIds ?? []),
    enabled: !!dogIds?.resultIds,
  });

  if (isLoading || !breeds || !dogs)
    return (
      <Layout className="min-h-0">
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Search</h1>
      <div className="mt-2 flex items-center justify-start space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 lg:flex">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search filters</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Breeds
                </Label>
                <MultiSelect
                  options={breeds.map((x) => ({ label: x, value: x }))}
                  placeholder="Select breeds..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Locations
                </Label>
                <MultiSelect
                  options={[{ label: 'test', value: 'test' }]}
                  placeholder="Select locations..."
                  className="col-span-3"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button
          variant="outline"
          size="sm"
          className="h-8 transition duration-200 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600  lg:flex"
          onClick={() => navigate('/match')}
        >
          <Heart className="mr-2 h-4 w-4" />
          Find Match
        </Button>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {dogs.map((dog) => (
          <DogProfile key={dog.id} {...dog} />
        ))}
      </div>
    </Layout>
  );
}
