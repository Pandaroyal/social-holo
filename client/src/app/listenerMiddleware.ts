import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import { RootState, AppDispatch } from '../app/store'
import { addPostsListeners, updatePostListeners } from '../features/posts/postsSlice'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()

export type AppStartListening = typeof startAppListening

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()

export type AppAddListener = typeof addAppListener


addPostsListeners(startAppListening)
updatePostListeners(startAppListening)