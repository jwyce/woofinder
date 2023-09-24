import { makeApi, makeEndpoint, makeParameters, Zodios } from '@zodios/core';
import { z } from 'zod';

const dogSchema = z.object({
  id: z.string(),
  img: z.string(),
  name: z.string(),
  age: z.number(),
  zip_code: z.string(),
  breed: z.string(),
});
export type Dog = z.infer<typeof dogSchema>;

const locationSchema = z
  .object({
    zip_code: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    city: z.string(),
    state: z.string(),
    country: z.string().optional(),
  })
  .nullable();
export type Location = z.infer<typeof locationSchema>;

const coordinateSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});
export type Coordinate = z.infer<typeof coordinateSchema>;

const URL = 'https://frontend-take-home-service.fetch.com';

const login = makeEndpoint({
  method: 'post',
  path: '/auth/login',
  parameters: [
    {
      name: 'body',
      type: 'Body',
      schema: z.object({ name: z.string().optional(), email: z.string().optional() }),
    },
  ],
  response: z.string(),
  alias: 'login',
  description:
    'Sets an auth cookie, fetch-access-token, in the response headers. This will expire in 1 hour',
});

const logout = makeEndpoint({
  method: 'post',
  path: '/auth/logout',
  response: z.string(),
  parameters: [{ name: 'body', type: 'Body', schema: z.object({}) }],
  alias: 'logout',
  description: 'Hit this endpoint to end a user’s session. This will invalidate the auth cookie.',
});

const getDogBreeds = makeEndpoint({
  method: 'get',
  path: '/dogs/breeds',
  response: z.array(z.string()),
  alias: 'getDogBreeds',
  description: 'Returns an array of all possible breed names.',
});

const dogSearchParams = makeParameters([
  {
    name: 'breeds',
    description: 'an array of breeds',
    type: 'Query',
    schema: z.array(z.string()).optional(),
  },
  {
    name: 'zipCodes',
    description: 'an array of zip codes',
    type: 'Query',
    schema: z.array(z.string()).optional(),
  },
  {
    name: 'ageMin',
    description: 'a minimum age',
    type: 'Query',
    schema: z.number().optional(),
  },
  {
    name: 'ageMax',
    description: 'a maximum age',
    type: 'Query',
    schema: z.number().optional(),
  },
  {
    name: 'size',
    description: 'the number of results to return; defaults to 25 if omitted',
    type: 'Query',
    schema: z.number().optional(),
  },
  {
    name: 'from',
    description: 'a cursor to be used when paginating results (optional)',
    type: 'Query',
    schema: z.string().optional(),
  },
  {
    name: 'sort',
    description:
      'the field by which to sort results, and the direction of the sort; in the format sort=field:[asc|desc]',
    type: 'Query',
    schema: z.string().optional(),
  },
]);

const searchDogs = makeEndpoint({
  method: 'get',
  path: '/dogs/search',
  response: z.object({
    resultIds: z.array(z.string()),
    total: z.number(),
    next: z.string().optional(),
    prev: z.string().optional(),
  }),
  parameters: dogSearchParams,
  alias: 'searchDogs',
  description: 'Returns an array of all possible breed names.',
  responseDescription:
    'The maximum total number of dogs that will be matched by a single query is 10,000.',
});

const dogs = makeEndpoint({
  method: 'post',
  path: '/dogs',
  response: z.array(dogSchema),
  parameters: [{ type: 'Body', schema: z.array(z.string()).max(100), name: 'body' }],
  alias: 'getDogs',
  description: 'Returns an array of dog objects',
});

const match = makeEndpoint({
  method: 'post',
  path: '/dogs/match',
  response: z.object({ match: z.string() }),
  parameters: [{ type: 'Body', schema: z.array(z.string()), name: 'body' }],
  alias: 'findMatch',
  description:
    'This endpoint will select a single ID from the provided list of dog IDs. This ID represents the dog the user has been matched with for adoption.',
});

const locations = makeEndpoint({
  method: 'post',
  path: '/locations',
  response: z.array(locationSchema),
  parameters: [{ type: 'Body', schema: z.array(z.string()).max(100), name: 'body' }],
  alias: 'getLocations',
  description: 'Returns an array of Location objects',
});

const locationSearchParams = makeParameters([
  {
    name: 'body',
    type: 'Body',
    description: 'the full or partial name of a city',
    schema: z.object({
      city: z.string().optional(),
      states: z.array(z.string()).optional(),
      geoBoundingBox: z
        .object({
          top: coordinateSchema.optional(),
          left: coordinateSchema.optional(),
          bottom: coordinateSchema.optional(),
          right: coordinateSchema.optional(),
          bottom_left: coordinateSchema.optional(),
          top_left: coordinateSchema.optional(),
          bottom_right: coordinateSchema.optional(),
          top_right: coordinateSchema.optional(),
        })
        .optional(),
      size: z.number().optional(),
      from: z.string().optional(),
    }),
  },
]);

const searchLocations = makeEndpoint({
  method: 'post',
  path: '/locations/search',
  response: z.object({ results: z.array(locationSchema), total: z.number() }),
  parameters: locationSearchParams,
  alias: 'searchLocations',
  description: 'Returns an array of Location objects',
});

const api = makeApi([
  login,
  logout,
  getDogBreeds,
  searchDogs,
  dogs,
  match,
  locations,
  searchLocations,
]);
export const fetchApi = new Zodios(URL, api, {
  axiosConfig: {
    withCredentials: true,
  },
});
