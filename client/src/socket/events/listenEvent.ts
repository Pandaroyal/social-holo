import store from '../../app/store';
import { apiSlice } from '../../features/api/apiSlice';
import { apiSliceWithNotifications, NotificationType } from '../../features/notifications/notificationsSlice';
import { apiSliceWithUsers, User } from '../../features/users/usersSlice';
import { toastDisplay } from '../../utils/helper';
import { socketService } from  '../socket';
import { events } from '../socketEvents.constants';

export function listenForEvents(user: User) {

  socketService.listenEvent(events.FOLLOW, (data) => {
    console.log("follow event listened -> ");
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))
    store.dispatch(apiSliceWithUsers.util.invalidateTags(['Follow']));
    user.isNotificationsOn && user.follows && toastDisplay(data.message);
  });

  socketService.listenEvent(events.REQUEST, (data) => {
    console.log("request event listened");
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))
    store.dispatch(apiSliceWithUsers.util.invalidateTags(['Follow']));
    user.isNotificationsOn && user.requests && toastDisplay(data.message);
  }); 

  socketService.listenEvent(events.ACCEPT, (data) => {
    console.log("accept event listened");
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))
    store.dispatch(apiSliceWithUsers.util.invalidateTags(['Follow']))
    user.isNotificationsOn && user.accepts && toastDisplay(data.message);
  })

  socketService.listenEvent(events.POST_ADDED, (data) => {
    console.log("post added event listened");
    // store.dispatch(apiSlice.util.updateQueryData('getPosts', undefined, draft => {
    //   // Add new post
    //   draft.posts.unshift(data.post);
    // }));
    store.dispatch(apiSlice.util.invalidateTags(['Post']));
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))

    user.isNotificationsOn && user.addPosts && toastDisplay(data.message);
  });

  socketService.listenEvent(events.LIKE, (data) => {
    // Dispatch RTK Query cache updates for notifications, posts, and unread count
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))

    store.dispatch(apiSlice.util.updateQueryData('getPosts', undefined, draft => {
      // Find the specific post and update its reactions
      const post = draft.posts.find(post => post.id === data.notification.postId)
      const publicPost = draft.publicPosts.find(post => post.id === data.notification.postId)
      post && post.likes_count++;
      publicPost && publicPost.likes_count++;
    }));

    store.dispatch(apiSlice.util.updateQueryData('getPost', data.notification.postId, draft => {
      draft.id === data.notification.postId && draft.likes_count++;
    }))

    store.dispatch(apiSlice.util.updateQueryData('getUserPosts', data.notification.recipientId, draft => {
      const post = draft.find(post => post.id === data.notification.postId)
      post && post.likes_count++;
    }))

    user.isNotificationsOn && user.likes && toastDisplay(data.message);
  });

  socketService.listenEvent(events.COMMENT, (data) => {
    console.log("comment event listened");
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))
    store.dispatch(apiSlice.util.invalidateTags(['Comments']));
    store.dispatch(apiSlice.util.updateQueryData('getPosts', undefined, draft => {
      const post = draft.posts.find(post => post.id === data.notification.postId)
      const publicPost = draft.publicPosts.find(post => post.id === data.notification.postId)
      post && post.comments_count++;
      publicPost && publicPost.comments_count++;
    }))
    
    store.dispatch(apiSlice.util.updateQueryData('getPost', data.notification.postId, draft => {
      draft.id === data.notification.postId && draft.comments_count++;
    }))

    store.dispatch(apiSlice.util.updateQueryData('getUserPosts', data.notification.recipientId, draft => {
      const post = draft.find(post => post.id === data.notification.postId)
      post && post.comments_count++;
    }))

    user.isNotificationsOn && user.comments && toastDisplay(data.message);
  })

  socketService.listenEvent(events.REPLY, (data) => {
    console.log("comment event listened");
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))
    store.dispatch(apiSlice.util.invalidateTags(['Comments']));
    user.isNotificationsOn && user.replies && toastDisplay(data.message);
  })

  socketService.listenEvent(events.SHARE, (data) => {
    console.log("share event listened");
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications.unshift(data.notification);
      draft.unreadCount++;
    }))
    console.log(data.message);
  })
  

  socketService.listenEvent(events.UNLIKE, (data) => {
    // Dispatch RTK Query cache updates for notifications, posts, and unread count
    console.log("unlike data -> ",data);
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.notifications = draft.notifications.filter( ({ actorId, postId, type }) => actorId !== actorId || postId !== data.postId || type !== NotificationType.LIKE )
      if(draft.unreadCount > 0) draft.unreadCount--;
    }));

    store.dispatch(apiSlice.util.updateQueryData('getPosts', undefined, draft => {
      // Find the specific post and update its reactions
      const post = draft.posts.find(post => post.id === data.postId)
      const publicPost = draft.publicPosts.find(post => post.id === data.postId)
      post && post.likes_count--;
      publicPost && publicPost.likes_count--;
    }));

    store.dispatch(apiSlice.util.updateQueryData('getPost', data.notification.postId, draft => {
      draft.id === data.notification.postId && draft.likes_count++;
    }))

    store.dispatch(apiSlice.util.updateQueryData('getUserPosts', data.notification.recipientId, draft => {
      const post = draft.find(post => post.id === data.notification.postId)
      post && post.likes_count++;
    }))


  });
}