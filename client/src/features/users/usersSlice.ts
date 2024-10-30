import { createEntityAdapter, EntityState, createSelector } from "@reduxjs/toolkit";
import { Settings } from '../settings/settingsSlice';
import { apiSlice } from "../api/apiSlice";

export interface FollowStatus {
  id: string,
  isAccepted: boolean
}

export enum AccountType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export interface User extends Settings {
    id: string,
    name: string,
    username: string,
    email: string,
    avatar: string,
    bio: string,
    account_type: AccountType,
    posts_count: number,
    followers_count: number,
    followings_count: number
    followStatus: FollowStatus | null,
    isFollowing?: FollowStatus | null
}

export interface UpdateUser{
  name: string
  username: string
  email: string
  bio: string
}

export interface UpdatePasswordDto{
  password: string
  new_password: string
}

export interface Followers {
  id: string,
  name: string,
  username: string,
  avatar: string,
  followStatus: FollowStatus | null
  requestId: string | null
}

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

const emptyUsers: User[] = []

export const apiSliceWithUsers = apiSlice.injectEndpoints({
    endpoints: builder => ({
      getUsers: builder.query<EntityState<User, string>, void>({
        query: () => '/users',
        transformResponse(res: User[]) {
            // Create a normalized state object containing all the user items
            return usersAdapter.setAll(initialState, res)
        },
      }),

      getUser: builder.query<User, string>({
        query: (id) => '/users/' + id,
        providesTags: (result, error, id) => ['Follow', { type: 'Users', id }],
      }),

      getFollowers: builder.query<Followers[], { followerId: string, search?: string }>({
        query: ( query ) => `/users/followers/${query.followerId + ( query.search ? '?search=' + query.search : '')}`,
        providesTags: (result, error, query) => ['Follow', { type: 'Users', id: query.followerId }],
      }),

      getFollowing: builder.query<Followers[], { followingId: string, search?: string }>({
        query: (query) => `/users/following/${query.followingId + ( query?.search ? '?search=' + query.search : '' )}`,
        providesTags: (result, error, query) => ['Follow', { type: 'Users', id: query.followingId }],
      }),

      getRequests: builder.query<Followers[], void>({
        query: () => '/users/requests',
        providesTags: (result, error, query) => ['Follow'],
      }),

      follow: builder.mutation<void, string>({
        query: (id) => ({
          url: '/users/follow/' + id,
          method: 'POST',
        }),
        invalidatesTags: ['Follow'],
      }),

      unfollow: builder.mutation<void, string>({
        query: (id) => ({
          url: '/users/unfollow/' + id,
          method: 'DELETE',
        }),
        invalidatesTags: ['Follow'],
      }),

      search: builder.query<Followers[], string>({
        query: (search) => ({
          url: '/users/search/?search=' + search,
          method: 'GET',
        }),
        providesTags: (result, error, query) => ['Follow'],
      }),

      switchAccountType: builder.mutation<void, string>({
        query: () => ({
          url: '/users/account-type',
          method: 'PATCH',
        }),
        invalidatesTags: (result, error, id) => ['Follow', { type: 'Users', id }],
      }),

      requestAccept: builder.mutation<void, string>({
        query: (id) => ({
          url: '/users/request-accepted/'+ id,
          method: 'PATCH',
        }),
        invalidatesTags: ['Follow'],
      }),

      updateUser: builder.mutation<void, {id: string, body: UpdateUser }>({
        query: payload => ({
          url: '/users/'+payload.id,
          method: "PATCH",
          body: payload.body
        }),
        invalidatesTags: (result, error, arg) => ['Follow', { type: 'Users', id: arg.id }],
      }),

      changePassword: builder.mutation<void, UpdatePasswordDto>({
        query: body => ({
          url: 'users/change-password',
          method: 'PATCH',
          body
        })
      })
    })
  })

export const { 
  useGetUsersQuery, useGetUserQuery, useGetRequestsQuery,
  useFollowMutation, useUnfollowMutation, 
  useGetFollowersQuery, useGetFollowingQuery,
  useSearchQuery, useSwitchAccountTypeMutation,
  useRequestAcceptMutation,
  useUpdateUserMutation, useChangePasswordMutation,
} = apiSliceWithUsers

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()

export const selectUsersData = createSelector(  
    selectUsersResult,
    result => result?.data ?? initialState
)

export const {selectAll: selectAllUsers, selectById: selectUserById, selectIds: selectUserIds, selectTotal: selectTotalUsers} = usersAdapter.getSelectors(selectUsersData)
