import { AppStartListening } from "../../app/listenerMiddleware"
import { apiSlice } from "../api/apiSlice"

export interface Media {
  id: string,
  url: string
  width: number
  height: number
  format: string
}

export interface Post {
    id: string,
    content: string
    creatorId: string | null
    createdAt: string
    likes_count: number
    comments_count: number
    shares_count: number
    isLiked: boolean
    media: Media[]
}

export interface Comment {
  id: string,
  postId: string, 
  content: string, 
  commenterId: string,
  commenterName: string,
  createdAt: string,
  replies_count: number
}

export type UpdatedPost = Pick<Post, "id" | "content">
export interface NewPost {
  content: string,
  files: File[]
}

export const addPostsListeners = (startAppListening: AppStartListening) => {
    startAppListening({
      matcher: apiSlice.endpoints.addNewPost.matchFulfilled,
      effect: toastDisplayEffect("New Post Added!")
    })
  }

export const updatePostListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    matcher: apiSlice.endpoints.updatePost.matchFulfilled,
    effect: toastDisplayEffect("Post Updated!")
  })
}

const toastDisplayEffect = (text: string) => {
  return async (action: any, listenerApi: { delay: (arg0: number) => any }) => {
    const { toast } = await import('react-tiny-toast')

    const toastId = toast.show(text, {
      variant: 'success',
      position: 'bottom-right',
      pause: true
    })

    await listenerApi.delay(5000)
    toast.remove(toastId)
  }
}