import { createEntityAdapter, createSelector, createSlice, createAction, isAnyOf } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { forceGenerateNotifications } from '../../api/server'
import type { RootState, AppThunk } from '../../app/store'
import { createAppAsyncThunk } from '../../app/withTypes'
import { apiSlice } from '../api/apiSlice'
import { socketService } from '../../socket/socket'
import { events } from '../../socket/socketEvents.constants'
import { toastDisplay } from '../../utils/helper'
import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query'

export enum NotificationType {
  FOLLOW = 'follow',
  REQUEST = 'request',
  ACCEPT = 'accept',
  POST_ADDED = 'post-added',
  LIKE = 'like',
  COMMENT = 'comment',
  REPLY = 'reply',
  SHARE = 'share',
}

export interface Notification {
  id: string
  recepientId: string
  postId: string
  actorId: string
  type: NotificationType
  message: string
  createdAt: string
  readAt: boolean
}

export interface ServerNotification {
  notifications: Notification[]
  unreadCount: number
}

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<ServerNotification, void>({
      query: () => '/notifications',
      providesTags: (result = { notifications: [], unreadCount: 0 }, error, arg) => [
        'Notifications',  // This invalidates the collection
        ...result.notifications.map(({ id }) => ({ type: 'Notifications', id }) as const)  // Map individual notifications   items
      ]
    }),

    read: builder.mutation<void, string>({
      query: id => ({
        url: '/notifications/read/'+id,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notifications', id}]
    }),

    deleteNotification: builder.mutation<void, string>({
      query: id => ({
        url: `/notifications/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notifications', id }, 'Notifications']
    }),

    deleteAllNotifications: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    })

  })
})

export const { useGetNotificationsQuery, useDeleteNotificationMutation, useDeleteAllNotificationsMutation, useReadMutation } = apiSliceWithNotifications