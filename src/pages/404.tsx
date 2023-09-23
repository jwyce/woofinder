import notfound from '~/assets/404.png';

import { Layout } from '~/components/layout';

export function NotFound() {
  document.title = 'Page not found | Woofinder';

  return (
    <Layout className="min-h-0">
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2">
          <div className="text-8xl font-extrabold md:text-[10rem]">4</div>
          <img src={notfound} className="h-24 w-24 md:h-[10rem] md:w-[10rem]" />
          <div className="text-8xl font-extrabold md:text-[10rem]">4</div>
        </div>
        <p className="text-sm text-muted-foreground">The requested page was not found!</p>
      </div>
    </Layout>
  );
}
