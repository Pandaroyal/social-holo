import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type { Post, NewPost, UpdatedPost, Comment } from '../posts/postsSlice'
import { socketService } from '../../socket/socket';
import { events } from '../../socket/socketEvents.constants';
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
      baseUrl: 'http://localhost:8000/',
      credentials: 'include'
    }),
    tagTypes: ['Posts', 'Post', 'Notifications', 'Users', 'Follow', "Comments"],
    endpoints: builder => ({

        getPosts: builder.query<{ posts: Post[], publicPosts: Post[] }, void>({
            query: () => '/posts',
            providesTags: (result = { posts: [], publicPosts: [] }, error, arg) => [
                'Post',
                { type: 'Posts', id: 'LIST' },  // This invalidates the collection
                ...result.posts.map(({ id }) => ({ type: 'Posts', id }) as const),  // Map individual post items
                ...result.publicPosts.map(({ id }) => ({ type: 'Posts', id }) as const)
            ]
        }),

        getDeletedPosts: builder.query<Post[], void>({
            query: () => '/posts/bin',
            providesTags: (result = [], error, arg) => [
                { type: 'Posts', id: 'LIST' },  // This invalidates the collection
                ...result.map(({ id }) => ({ type: 'Posts', id }) as const)  // Map individual post items
            ]
        }),

        getPost: builder.query<Post, string>({
            query: (id) => `/posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Posts', id }]
        }),

        getUserPosts: builder.query<Post[], string>({
            query: (id) => `/posts/user/${id}`,
            providesTags: (result, error, id) => ['Post',{ type: 'Posts', id }]
        }),

        addNewPost: builder.mutation<Post, any>({
            query: newPost => ({
                url: '/posts',
                method: 'POST',
                body: newPost
            }),
            invalidatesTags: ['Posts']
        }),

        likePost: builder.mutation<Post, {userId: string, postId: string}>({
            query: payload => ({
                url: `/posts/like/${payload.postId}`,
                method: 'POST',
            }),
            // The `invalidatesTags` line has been removed,
            // since we're now doing optimistic updates
            async onQueryStarted({postId, userId}, lifecycleApi) {
              // `updateQueryData` requires the endpoint name and cache key arguments,
              // so it knows which piece of cache state to update
              const getPostsPatchResult = lifecycleApi.dispatch(
                apiSlice.util.updateQueryData('getPosts', undefined, draft => {
                  console.log("postId in getPosts -> ", postId);
                  // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                  const post = draft.posts.find(post => post.id === postId)
                  const publicPost = draft.publicPosts.find(post => post.id === postId)
                  if (post) {
                    post.isLiked = !post.isLiked
                    post.isLiked ? post.likes_count++ : post.likes_count--;
                  }
                  if(publicPost) {
                    publicPost.isLiked = !publicPost.isLiked
                    publicPost.isLiked ? publicPost.likes_count++ : publicPost.likes_count--;
                  }

                })
              )
            
              // We also have another copy of the same data in the `getPost` cache
              // entry for this post ID, so we need to update that as well
              const getPostPatchResult = lifecycleApi.dispatch(
                apiSlice.util.updateQueryData('getPost', postId, draft => {
                  console.log("postId in getPost -> ", postId);
                  if(draft.id === postId){
                    if(typeof draft.isLiked === 'string' && draft.isLiked === '0'){
                      draft.isLiked = false
                    }
                    draft.isLiked = !draft.isLiked
                    draft.isLiked ? draft.likes_count++ : draft.likes_count--;
                  }
                })
              )

              const getUserPostsPatchResult = lifecycleApi.dispatch(
                apiSlice.util.updateQueryData('getUserPosts', userId, draft => {
                  console.log("postId in getUserPosts -> ", postId);
                  console.log("draft -> ", postId);
                  const post = draft.find(post => post.id === postId)
                  if(post) {
                    post.isLiked = !post.isLiked
                    post.isLiked ? post.likes_count++ : post.likes_count--;
                  }
                })
              )
            
              try {
                await lifecycleApi.queryFulfilled
              } catch {
                getPostsPatchResult.undo()
                getPostPatchResult.undo()
                getUserPostsPatchResult.undo()
              }
            }
        }),

        getComments: builder.query<Comment[], { postId: string, parentCommentId?: string }>({
            query: ({ postId, parentCommentId }) => `/posts/${postId}/comments${parentCommentId ? `?parentCommentId=${parentCommentId}` : ''}`,
            providesTags: (result=[], error, arg) => [
              'Comments',
              ...result.map(({ id }) => ({ type: 'Comments', id }) as const) 
            ]
        }),

        addComment: builder.mutation<Comment, { id: string, userId: string, body: { content: string, parentCommentId?: string } }>({
            query: comment => ({
                url: `/posts/${comment.id}/comment`,
                method: 'POST',
                body: { ...comment.body }
            }),
            invalidatesTags: ['Comments'],
            async onQueryStarted({id: postId, userId}, lifecycleApi) {
              // `updateQueryData` requires the endpoint name and cache key arguments,
              // so it knows which piece of cache state to update
              const getPostsPatchResult = lifecycleApi.dispatch(
                apiSlice.util.updateQueryData('getPosts', undefined, draft => {
                  // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                  const post = draft.posts.find(post => post.id === postId)
                  const publicPost = draft.publicPosts.find(post => post.id === postId)
                  post && post.comments_count++;
                  publicPost && publicPost.comments_count++;
                })
              )
            
              // We also have another copy of the same data in the `getPost` cache
              // entry for this post ID, so we need to update that as well
              const getPostPatchResult = lifecycleApi.dispatch(
                apiSlice.util.updateQueryData('getPost', postId, draft => {
                  draft.id === postId && draft.comments_count++;
                })
              )

              const getUserPostsPatchResult = lifecycleApi.dispatch(
                apiSlice.util.updateQueryData('getUserPosts', userId, draft => {
                  // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                  const post = draft.find(post => post.id === postId)
                  post && post.comments_count++;
                })
              )
            
              try {
                await lifecycleApi.queryFulfilled
              } catch {
                getPostsPatchResult.undo()
                getPostPatchResult.undo()
                getUserPostsPatchResult.undo()
              }
            }
        }),

        updatePost: builder.mutation<any, UpdatedPost>({
            query: updatedPost => ({
                url: `/posts/${updatedPost.id}`,
                method: 'PATCH',
                body: { content: updatedPost.content }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Posts', id: arg.id }]
        }),

        removePost: builder.mutation<void, string>({
            query: id => ({
                url: `/posts/remove/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Posts', id: arg }]
        }),

        restorePost: builder.mutation<void, { id: string }>({
            query: arg => ({
                url: `/posts/restore/${arg.id}`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, arg) => ['Post', { type: 'Posts', id: arg.id }]
        }),

        deletePost: builder.mutation<void, string>({
            query: id => ({
                url: `/posts/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Posts', id: arg }]
        }),
    })
})

export const { 
    useGetPostsQuery, useGetPostQuery, useGetDeletedPostsQuery, useGetUserPostsQuery,
    useLikePostMutation,
    useGetCommentsQuery, useAddCommentMutation,
    useAddNewPostMutation,
    useUpdatePostMutation, useRestorePostMutation,
    useRemovePostMutation, useDeletePostMutation,
} = apiSlice;

export const { resetApiState } = apiSlice.util; 