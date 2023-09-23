import { cn } from '~/lib/utils';

import { Header } from './header';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function Layout(props: LayoutProps) {
  return (
    <main>
      <Header />
      <div className="flex">
        <div
          className={cn('mt-14 min-h-screen w-full px-8 py-4 text-lg md:px-12', props.className)}
        >
          {props.children}
        </div>
      </div>
    </main>
  );
}
