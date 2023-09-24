import { useMutation } from '@tanstack/react-query';

import { fetchApi } from '~/lib/fetch-client';
import { useWoofinderStore } from '~/lib/store';

import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import logo from '/woofinder.png';

export function Header() {
  const user = useWoofinderStore((state) => state.user);
  const setUser = useWoofinderStore((state) => state.setUser);
  const clearFavorites = useWoofinderStore((state) => state.clearFavorites);
  const logout = useMutation({ mutationFn: fetchApi.logout });

  const [first, last] = user?.name ? user.name.split(' ') : ['M', 'E'];

  return (
    <div className="fixed z-10 w-full">
      <header className="flex items-center justify-between bg-background px-4 py-2">
        <div className="flex items-center justify-start space-x-2">
          <img src={logo} height={50} width={50} alt="woofinder logo" />
          <span className="text-2xl font-extrabold">Woofinder</span>
        </div>
        <div className="flex items-center justify-start space-x-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger name="profile">
                <Avatar>
                  <AvatarImage src={user.avatar} alt="avatar" />
                  <AvatarFallback className='uppercase'>
                    {first[0]}
                    {last ? last[0] : null}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-sm font-medium leading-none">
                  {user.name}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    const res = await logout.mutateAsync({});
                    if (res === 'OK') {
                      setUser(undefined);
                      clearFavorites();
                    }
                  }}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </header>
      <Separator />
    </div>
  );
}
