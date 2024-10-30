import { BadGatewayException, Injectable } from '@nestjs/common';
import type { CreatePostDto } from './dto/createPostDto';
import { DataSource, IsNull, LessThan, Not, Repository } from 'typeorm';
import { Posts } from '../entities/posts.entity';
import { UpdatePostDto } from './dto/updatePostDto';
// import { NotificationsService } from '../notifications/notifications.service';
import { getCommentsQueryBuilder } from '../utils/queries';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { PostsMedia } from '../entities/posts_media.entity';
import { CreatePostMediaDto } from '../dto/create-post-media.dto';
import { getPostsQueryBuilder } from '../utils/queries';
import { PostsLikes } from '../entities/posts_likes.entity';
import { PostsComments } from '../entities/posts_comments.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationType } from '../entities/notifications.entity';
import { Users } from '../entities/users.entity';

@Injectable()
export class PostsService {
  constructor(
    private dataSource: DataSource, 
    private usersService: UsersService,
    private notificationsGateway: NotificationsGateway
  ){}

  create(newPost: CreatePostDto, files: CreatePostMediaDto[], user: any): Promise<any>{
    return this.dataSource.transaction( async manager => {
      const content = newPost.content;
      let post = await manager.save(Posts, {content, creatorId: user.id});
      if(files && files.length > 0) {
        await Promise.all(files.map((file) => {
          return manager.save(PostsMedia, {
            postId: post.id,
            url: file.secure_url,
            width: file.width,
            height: file.height,
            format: file.format,
          });
        }));
      } 

      const followers = await this.usersService.allFollowers( user.id, user.id );
      this.notificationsGateway.handleNewPost(followers, { postId: post.id, actorId: user.id, type: NotificationType.POST_ADDED }, `${user.username} added a post to their feed`);
      return {... post, isLiked: false, media: files};
    })
  }

  async findAll(userId: string){
    const postRepository = this.dataSource.getRepository(Posts);
    let followingsIds = await this.usersService.allFollowing(userId, userId);
    followingsIds = followingsIds.map(obj => obj.id);
    followingsIds.push(userId);
    const result1 = await getPostsQueryBuilder(postRepository, userId, { followingIds: followingsIds }).getRawMany();
    const result2 = await getPostsQueryBuilder(postRepository, userId, { followingIds: followingsIds, followingsNot: true }).getRawMany();
    return { posts: result1, publicPosts: result2 };
  }

  async findOne(postId: string, userId: string) {
    const postRepository = this.dataSource.getRepository(Posts);
    const query = getPostsQueryBuilder(postRepository, userId, { postId });
    return await query.getRawOne();
  }

  async findUserPosts(creatorId: string, userId: string) {
    const postRepository = this.dataSource.getRepository(Posts);
    const query = getPostsQueryBuilder(postRepository, userId, { creatorId });
    return await query.getRawMany();
  }

  async like(id: string, user: Users) { 
    const userId = user.id;   
    return this.dataSource.transaction(async manager => {
      try{
        // Check if the post exists
        const post = await manager.findOne(Posts, { where: {id}});
        if (post) {

          // check if the user has already liked the post
          const liked = await manager.findOne(PostsLikes, {where: {postId: id, userId}});
          if(liked) {
            user.id !== post.creatorId && this.notificationsGateway.handleUnlike(post.creatorId, {postId: id, actorId: userId, type: NotificationType.LIKE})
            // If the user has already liked the post, remove the like
            return manager.delete(PostsLikes, {postId: id, userId})
          }

          user.id !== post.creatorId && this.notificationsGateway.handleLike(post.creatorId, { postId: id, actorId: userId, type: NotificationType.LIKE}, `${user.username} likes your post`)
          // If the user has not liked the post, add the like
          return manager.save(PostsLikes, {postId: id, userId})
        }
        throw new Error('Posts not found'); // Handle Posts not found scenario
      }
      catch(err){
        throw new Error(String(err));
      }
    })
  }

  async getComments(id: string, parentCommentId?: string) {
    const postsComments = this.dataSource.getRepository(PostsComments);
    const query = getCommentsQueryBuilder(postsComments, id, parentCommentId);     
   return query.getRawMany();
  }


  addComment(id: string, user: any, body: CreateCommentDto) {
    const commenterId = user.id
    return this.dataSource.transaction(async manager => {
      const post = await manager.findOne(Posts, { where: {id}});
      if (post) {
        if(body.parentCommentId) {
          const comment = await manager.findOne(PostsComments, {where: {id: body.parentCommentId}});
          if(comment) {
            comment.commenterId !== user.id && this.notificationsGateway.handleReply(comment.commenterId, { postId: id, actorId: commenterId, type: NotificationType.REPLY }, `${user.username} reply to your comment`)
            return manager.save(PostsComments, {postId: id, commenterId, ...body} )
          }
        }
        post.creatorId !== user.id && this.notificationsGateway.handleComment(post.creatorId, { postId: id, actorId: commenterId, type: NotificationType.COMMENT }, `${user.username} comments on your post`)
        console.log("comment content -> ", body.content);
        return manager.save(PostsComments, {postId: id, commenterId, ...body} )
      }
      throw new Error('Posts not found'); // Handle Posts not found scenario
    })
  }

  getReplies(id: string) {
    return this.dataSource.transaction(async manager => {
      const post = await manager.findOne(Posts, { where: {id}});
      if (post) {
        return manager.find(PostsComments, {where: {parentCommentId: id}})
      }
      throw new Error('Posts not found'); // Handle Posts not found scenario
    })
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.dataSource.transaction(async manager => {
      console.log(id);
      const post = await manager.findOne(Posts, { where: {id}});
      console.log(post);
      if(!post){
        return "Posts not found"
      }
      return await manager.update(Posts, id, updatePostDto)
    });
  }

  async remove(id: string) {
    return this.dataSource.transaction(async manager => {
      const post = await manager.findOne(Posts, {where: {id}});
      if (!post) {
        throw new Error('Posts not found'); // Handle Posts not found scenario
      }

      const date = new Date()
      manager.update(PostsMedia, {postId: id}, {deletedAt: date})
      await manager.update(Posts, id, {deletedAt: date})
    })
  }

  async getDeletedFiles (id:string) {
    console.log("get Deleted Files service runs ", id);
    return this.dataSource.transaction(async manager => {
      return manager.find(Posts, {where: {creatorId: id, deletedAt: Not(IsNull())}, withDeleted: true})
    })
  }
  
  restore(id: string) {
    return this.dataSource.transaction(async manager => {
      await manager.update(Posts, id, {deletedAt: null});
      await manager.update(PostsMedia, {postId: id}, {deletedAt: null})
    })
  }

  delete(id: string){
    return this.dataSource.transaction(async manager => {
      const post = await manager.findOne(Posts, {where: {id}, withDeleted: true});
      if (!post) {
        return "Posts Not Found";// Handle Posts not found scenario
      }

      await manager.delete(Posts, id)
    })
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async clearDeletedPosts() {
  //   const thresholdDate = new Date();
  //   thresholdDate.setMonth(thresholdDate.getMonth() - 1);

  //   this.dataSource.getRepository(Posts).delete({ deletedAt: LessThan(thresholdDate) });
  // }


}

