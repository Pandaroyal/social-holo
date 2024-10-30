import { Repository, SelectQueryBuilder } from "typeorm";
import { Posts } from "../entities/posts.entity";
import { PostsMedia } from "../entities/posts_media.entity";
import { PostsComments } from "../entities/posts_comments.entity";
import { AccountType, Users } from "../entities/users.entity";

export const postsSelect = [
    'p.id as id',
    'p.content as content',
    'p.creatorId as creatorId',
    'p.createdAt as createdAt',
    'p.likes_count as likes_count',
    'p.comments_count as comments_count',
    'p.shares_count as shares_count',
];

export const isLiked = `
    CASE WHEN EXISTS (
       SELECT 1
       FROM posts_likes as pl
       WHERE pl.postId = p.id AND pl.userId = :userId
     ) THEN true ELSE false 
    END`;

export const commentsSelect = [
  'pc.id as id',
  'pc.postId as postId',
  'pc.content as content',
  'pc.createdAt as createdAt',
  'pc.commenterId as commenterId',
  'users.username as commenterName',
  'COALESCE(reply_counts.replies_count, 0) as replies_count'
]

export const userSelect = [
  'users.id as id',
  'users.name as name',
  'users.username as username',
  'users.email as email',
  'users.avatar as avatar',
  'users.bio as bio',
  'users.account_type as account_type',
  'users.posts_count as posts_count',
  'users.followers_count as followers_count',
  'users.followings_count as followings_count',
  's.theme as theme',
  's.language as language',
  's.isNotificationsOn as isNotificationsOn',
  'ns.follows as follows',
  'ns.requests as requests',
  'ns.accepts as accepts',
  'ns.addPosts as addPosts',
  'ns.likes as likes',
  'ns.comments as comments',
  'ns.replies as replies',
  'ns.shares as shares' 
]

export function getPostsQueryBuilder(
    postRepository: Repository<Posts>, 
    userId: string,
    options?: { postId?: string, creatorId?: string, followingIds?: string[], followingsNot?: Boolean }
  ): SelectQueryBuilder<Posts> {
    const query = postRepository
      .createQueryBuilder("p")
      .select(postsSelect)
      .addSelect(isLiked, "isLiked")
      .addSelect(subQuery => {
        return subQuery
          .select("JSON_ARRAYAGG(JSON_OBJECT('id', pm2.id, 'url', pm2.url, 'width', pm2.width, 'height', pm2.height, 'format', pm2.format))", "media")
          .from(PostsMedia, "pm2")
          .where("pm2.postId = p.id");
      }, "media")
      .setParameter("userId", userId)
      .leftJoin(PostsMedia, "pm", "pm.postId = p.id")
      .where("p.deletedAt IS NULL")
      .groupBy("p.id")
      .orderBy("p.createdAt", "DESC")
      .limit(10) // Optionally limit for pagination
      .offset(0); // Optionally offset for pagination

    if(options?.followingIds) {
      if(options.followingsNot) {
        query.andWhere("p.creatorId NOT IN (:followingIds)", { followingIds: options.followingIds })
        .leftJoin(Users, "u", "u.id = p.creatorId")
        .andWhere("u.account_type = :accountType", { accountType: AccountType.PUBLIC });
      } else {
        query.andWhere("p.creatorId IN (:followingIds)", { followingIds: options.followingIds });
      }
    }
  
    // If postId is provided, fetch a single post
    if (options?.postId) {
      query.andWhere("p.id = :postId", { postId: options.postId });
    }
  
    // If creatorId (user's ID) is provided, fetch posts of that user
    if (options?.creatorId) {
      query.andWhere("p.creatorId = :creatorId", { creatorId: options.creatorId });
    }
  
    return query;
  }
    
  
export function getCommentsQueryBuilder(
    commentsRepository: Repository<PostsComments>,
    postId: string,
    parentCommentId?: string
  )  {
    const query = commentsRepository
      .createQueryBuilder('pc')
      .select(commentsSelect)
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('replies.parentCommentId, COUNT(replies.id) AS replies_count')
            .from('posts_comments', 'replies')
            .where('replies.parentCommentId IS NOT NULL AND replies.postId = :postId', {postId})
            .groupBy('replies.parentCommentId');
        },
        'reply_counts',
        'reply_counts.parentCommentId = pc.id'
      )
      .innerJoin('users', 'users', 'users.id = pc.commenterId')
      .where('pc.postId = :postId', { postId })
      .orderBy('pc.createdAt', 'DESC')  // Order by created_at (or any other column)
      .limit(10);// Limit to 10 results (adjust as needed)

    if (parentCommentId !== undefined) {
      console.log("queries if parentCommentId -> ", parentCommentId);
      query.andWhere('pc.parentCommentId = :parentCommentId', { parentCommentId });
    } else {
      console.log("queries if else -> ", parentCommentId);
      query.andWhere('pc.parentCommentId IS NULL'); // Get only parent comments
    }

    return query;
  }