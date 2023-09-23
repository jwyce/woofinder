import { Heart, MapPin } from 'lucide-react';

import { Dog } from '~/lib/fetch-client';
import { useWoofinderStore } from '~/lib/store';
import { cn } from '~/lib/utils';

export function DogProfile(dog: Dog) {
  const favorites = useWoofinderStore((s) => s.favorites);
  const addFavorite = useWoofinderStore((s) => s.addFavorite);
  const removeFavorite = useWoofinderStore((s) => s.removeFavorite);

  return (
    <div className="flex justify-center">
      <div className="relative w-72 text-white drop-shadow-md md:w-96">
        <div className="absolute left-0 top-0 h-72 w-full rounded-lg bg-gradient-to-b from-transparent to-black opacity-90 md:h-96"></div>
        <img
          src={dog.img}
          className="h-72 w-72 select-none rounded-lg object-cover md:h-96 md:w-96 "
        />
        <Heart
          className={cn(
            'absolute bottom-2 right-2 h-8 w-8 cursor-pointer text-pink-500 transition duration-200 hover:scale-105 hover:text-pink-600 active:fill-pink-600',
            { 'fill-pink-600 text-pink-600': favorites.includes(dog.id) },
          )}
          onClick={() => {
            // invalidate cached queries
            if (favorites.includes(dog.id)) {
              removeFavorite(dog.id);
            } else {
              addFavorite(dog.id);
            }
          }}
        />
        <div className="absolute bottom-12 left-2 flex items-end space-x-2 text-3xl font-bold">
          <div>{dog.name}</div>
          <div className="text-2xl font-light">{dog.age}</div>
        </div>
        <div className="absolute bottom-6 left-2">{dog.breed}</div>
        <div className="absolute bottom-1 left-2 flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{dog.zip_code}</span>
        </div>
      </div>
    </div>
  );
}
