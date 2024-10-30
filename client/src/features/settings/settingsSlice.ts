import { apiSlice } from "../api/apiSlice";

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark'
  }

export interface NotificationsSettings{
    follows: boolean,
    requests: boolean,
    accepts: boolean,
    addPosts: boolean,
    likes: boolean,
    comments: boolean,
    replies: boolean
    shares: boolean,
}
  
export interface Settings extends NotificationsSettings {
    theme: Theme,
    language: string,
    isNotificationsOn: boolean
}

export const apiSliceWithSettings = apiSlice.injectEndpoints({
    endpoints: builder => ({
        toggleNotifications: builder.mutation<void, boolean>({
            query: params => ({
                url: '/settings/toggle-notification/'+params,
                method: 'PATCH',
            })
        }),

        updateNotificationsSettings: builder.mutation<void, NotificationsSettings>({
            query: body => ({
                url: '/settings/update-notifications-settings',
                method: 'PATCH',
                body
            })
        })
    })
})

export const { useToggleNotificationsMutation, useUpdateNotificationsSettingsMutation } = apiSliceWithSettings;