import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import noMatch from '~/assets/no-match.png';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  ArrayParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { z } from 'zod';

import { fetchApi } from '~/lib/fetch-client';
import { useShouldBeAuthed } from '~/lib/useShouldBeAuthed';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { Loader } from '~/components/ui/loader';
import { MultiSelect } from '~/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { Skeleton } from '~/components/ui/skeleton';
import { Slider } from '~/components/ui/slider';
import { DogProfile } from '~/components/dog-profile';
import { Layout } from '~/components/layout';

const searchSchema = z.object({
  breeds: z.array(z.string().nullable()).nullable(),
  sort: z.string().optional(),
  minAge: z.array(z.number()).optional(),
  maxAge: z.array(z.number()).optional(),
});

export function Search() {
  document.title = 'Search | Woofinder';
  useShouldBeAuthed(true);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useQueryParams({
    breeds: withDefault(ArrayParam, [] as string[]),
    sort: withDefault(StringParam, 'breed:asc'),
    maxAge: withDefault(NumberParam, undefined),
    minAge: withDefault(NumberParam, undefined),
    from: withDefault(StringParam, undefined),
  });

  const { data: breeds, isLoading } = useQuery({
    queryKey: ['dogBreeds'],
    queryFn: fetchApi.getDogBreeds,
  });

  const { data: dogIds } = useQuery({
    queryKey: ['dogIds', searchParams],
    queryFn: () =>
      fetchApi.searchDogs({
        queries: {
          size: 24,
          sort: searchParams.sort,
          breeds: searchParams.breeds as string[] | undefined,
          ageMax: searchParams.maxAge,
          ageMin: searchParams.minAge,
          from: searchParams.from,
        },
      }),
  });

  const { data: dogs } = useQuery({
    queryKey: ['dogs', dogIds],
    queryFn: () => fetchApi.getDogs(dogIds?.resultIds ?? []),
    enabled: !!dogIds?.resultIds,
    keepPreviousData: true,
  });

  const { data: dogLocations } = useQuery({
    queryKey: ['dogLocations', dogs],
    queryFn: () => fetchApi.getLocations(dogs ? dogs.map((x) => x.zip_code) : []),
    enabled: !!dogs,
    onSuccess: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      minAge: searchParams.minAge ? [searchParams.minAge] : [0],
      maxAge: searchParams.maxAge ? [searchParams.maxAge] : [20],
      sort: searchParams.sort,
      breeds: searchParams.breeds,
    },
  });

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    setSearchParams({
      breeds: values.breeds ?? [],
      maxAge: values.maxAge ? values.maxAge[0] : undefined,
      minAge: values.minAge ? values.minAge[0] : undefined,
      sort: values.sort,
      from: undefined,
    });
  }

  const nextFrom = dogIds?.next?.split('&').filter((x) => x.startsWith('from'));

  if (isLoading || !breeds)
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <SheetHeader>
                  <SheetTitle>Search filters</SheetTitle>
                </SheetHeader>

                <div className="mt-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="sort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed Sort</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sort direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breed:asc">Ascending</SelectItem>
                            <SelectItem value="breed:desc">Descending</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breeds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Breeds</FormLabel>
                        <MultiSelect
                          fieldValue={field.value ?? undefined}
                          options={breeds.map((x) => ({ label: x, value: x }))}
                          placeholder="Select breeds..."
                          className="col-span-3"
                          onSelect={(selected) => {
                            form.setValue(
                              'breeds',
                              selected.map((x) => x.value),
                              { shouldDirty: true },
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxAge"
                    render={({ field }) => (
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="maxAge">Max Age</Label>
                          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                            {field.value}
                          </span>
                        </div>
                        <Slider
                          id="maxAge"
                          max={20}
                          min={0}
                          defaultValue={field.value ?? [20]}
                          step={1}
                          onValueChange={field.onChange}
                          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                          aria-label="Max Age"
                        />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minAge"
                    render={({ field }) => (
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="minAge">Min Age</Label>
                          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                            {field.value}
                          </span>
                        </div>
                        <Slider
                          id="minAge"
                          max={20}
                          min={0}
                          defaultValue={field.value ?? [0]}
                          step={1}
                          onValueChange={field.onChange}
                          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                          aria-label="Min Age"
                        />
                      </div>
                    )}
                  />
                </div>

                <SheetFooter className="mt-5">
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
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
      {!dogs ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 24 }).map((_, idx) => (
            <Skeleton key={idx} className="h-72 w-72 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {dogs.length === 0 ? (
            <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-2">
                <img src={noMatch} alt="no match" className="h-24 w-24 md:h-[10rem] md:w-[10rem]" />
              </div>
              <p className="text-sm text-muted-foreground">
                No dogs matched your search criteria. Try widening your search.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {dogs.map((dog) => (
                <DogProfile key={dog.id} dog={dog} locations={dogLocations} />
              ))}
            </div>
          )}
        </>
      )}
      <div className="mt-8 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              const prevFrom = dogIds?.prev?.split('&').filter((x) => x.startsWith('from'));
              if (prevFrom?.length === 1) {
                setSearchParams({ from: prevFrom?.[0].split('=')[1] });
              }
            }}
            disabled={dogIds?.prev === undefined}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (nextFrom?.length === 1) {
                setSearchParams({ from: nextFrom?.[0].split('=')[1] });
              }
            }}
            disabled={
              nextFrom?.length === 1 && +nextFrom?.[0].split('=')[1] > (dogIds?.total ?? -1)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
