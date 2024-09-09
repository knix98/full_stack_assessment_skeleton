import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ROOT,
  timeout: 5000, // Timeout set to 5 seconds (5000 ms)
});

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery,
  tagTypes: ['User', 'Home', 'UserHome'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/user/find-all',
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: true,
      providesTags: (result) => result ? result.map(({ id }) => ({ type: 'User', id })) : [],
    }),
    getHomesForUser: builder.query({
      query: ({ userId, page }) => `/home/find-by-user?userId=${userId}&page=${page}`,
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: true,
      providesTags: (result) => result ? result.homes.map(({ id }) => ({ type: 'Home', id })) : [],
    }),
    getUsersForHome: builder.query({
      query: (homeId) => `/user/find-by-home/${homeId}`,
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: true,
      providesTags: [{ type: 'UserHome', id: 'LIST' }],
    }),
    updateUsersForHome: builder.mutation({
      query: ({ homeId, userIds }) => ({
        url: '/home/update-users',
        method: 'PUT',
        body: { homeId, userIds },
      }),
      invalidatesTags: (result, error, { homeId }) => [
        { type: 'Home', id: homeId },
        { type: 'UserHome', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetHomesForUserQuery,
  useGetUsersForHomeQuery,
  useUpdateUsersForHomeMutation,
} = usersApi;