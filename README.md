# Woofinder

## Tech Stack and Decisions

- **TypeScript** - Types enable me to move faster and make less mistakes.
- **Vite + React** - Since I don't own the server and the project is relatively small, I chose to
  forgo a server rendering framework (like Next.js) and instead use [Vite](https://vitejs.dev/) and
  React to assemble the pieces for a "home-made", fast, light-weight, client-side rendering
  framework. Although other rendering libraries have a lot to offer (shout-out Svelte and Solid) I'm
  most comfortable using React.
- **Tailwind + shadcn** - Tailwind allows me to rapidly iterate on designs in code and is a great
  abstraction over CSS. Leveraging [shadcn](https://ui.shadcn.com/) components also gives a good
  starting point for creating a design system.
- **Tanstack Router** - The [best routing solution](https://tanstack.com/router/v1) for React SPAs
  out there. Has type-safe routes, path params, and search paramas and fully handles param
  serialization. Also has automatic route preloading, works with SSR, can be used as a file based
  router, and so much more!
- ~~**React Router** - Currently the best way to manage client side routing so links can be shared
  and saved. I considered trying [Tanstack Router](https://tanstack.com/router/v1), but since it's
  still in beta, I decided against it.~~
- **React Query** - Solution for managing local state, caching, and invalidation between client and
  API.
- **Zustand** - So I can manage global application state. Redux would be overkill for this project
  and Context would have been more code. Also enabled me to persist and sync state with different
  storage options.
- **React Hook Form** - For managing form state on the sign-in and search pages.
- **Zodios + Zod** - To create a type-safe client SDK for the service and have the contract
  validated at _**runtime**_.

## Callouts

- **Not working in Safari or iOS browsers?** - From an initial investigation this seems to be due to
  Intelligent Tracking Prevention
  ([ITP](https://webkit.org/blog/7675/intelligent-tracking-prevention/#:~:text=Intelligent%20Tracking%20Prevention%20collects%20statistics,%2C%20clicks%2C%20and%20text%20entries))
  where cookies will not be used in a request (even HTTPOnly) if the request is to a different
  domain. One way around this would be to change our auth flow (not currently in my control) or to
  allow tracking from your device's settings.
- **Note on persisting global state** - Essentially, I wanted to have some level of persistence when
  a user is signed in so if they refresh, close the tab, internet turns off, or for any other number
  of reasons, application state is preserved. I chose to synchronize the global state store with
  localStorage to achieve this effect. If I had my own server or another service, I think a better
  route would be to sync it with a database.

## Credits

- **Google's Emoji Kitchen** - [emoji-kitchen](https://github.com/xsalazar/emoji-kitchen) for site
  assets
- **Vercel Avatar** - [vercel-avatar](https://github.com/vercel/avatar) for random user avatar image

## Running locally

### Prerequisites

Ensure you have [node](https://nodejs.org/en) and [pnpm](https://pnpm.io/) installed before
proceeding. The following instructions assume you are on Linux, macOS, or WSL.

### Run Development Server

1. Clone the repository: `git clone https://github.com/jwyce/woofinder`
2. Navigate to the project directory: `cd woofinder`
3. Install dependencies: `pnpm i`
4. Run the web app: `pnpm dev`
5. Click on the URL in the terminal output (defaults to `http://localhost:5173/`)
