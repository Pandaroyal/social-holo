import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TriggerService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {

    //  trigger to update count of posts_count in users table
    // Create trigger for INSERT
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_post_count_after_insert
          AFTER INSERT ON posts
          FOR EACH ROW
          BEGIN
            UPDATE users 
            SET posts_count = posts_count + 1
            WHERE id = NEW.creatorId;
          END;
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_post_count_after_insert`);
      console.log("in creating update_post_count_after_insert trigger -> \n",err);
    }

    // Create trigger for UPDATE
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_post_count_after_update
          AFTER UPDATE ON posts
          FOR EACH ROW
          BEGIN

            If(NEW.deletedAt IS NOT NULL AND OLD.deletedAt IS NULL) THEN
              UPDATE users 
              SET posts_count = posts_count - 1
              WHERE id = NEW.creatorId;
            END IF;

            If(NEW.deletedAt IS NULL AND OLD.deletedAt IS NOT NULL) THEN
              UPDATE users 
              SET posts_count = posts_count + 1
              WHERE id = NEW.creatorId;
            END IF;
            
          END;
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_post_count_after_update`);
      console.log("in creating update_post_count_after_update trigger -> \n",err);
    }

    // Create trigger for DELETE
    try{
      await this.dataSource.query(`
        CREATE TRIGGER IF NOT EXISTS update_post_count_after_delete
        AFTER DELETE ON posts
        FOR EACH ROW
        BEGIN
          UPDATE users 
          SET posts_count = posts_count - 1
          WHERE id = OLD.creatorId;
        END;
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_post_count_after_delete`);
      console.log("in creating update_post_count_after_delete trigger -> \n",err);
    }


    //  trigger to update count of followers_count and followings_count in users table
    // Create trigger for INSERT
    try{
      await this.dataSource.query(`
        CREATE TRIGGER IF NOT EXISTS update_counts_after_insert
        AFTER INSERT ON followers
        FOR EACH ROW
        BEGIN
          -- Check if the followingId user's account_type is not private
          IF (SELECT account_type FROM users WHERE id = NEW.followingId) != 'private' THEN

            -- Increment following_count for the user being followed
            UPDATE users 
            SET followings_count = followings_count + 1
            WHERE id = NEW.followerId;

            -- Increment followers_count for the user who is following
            UPDATE users 
            SET followers_count = followers_count + 1
            WHERE id = NEW.followingId;

          END IF;
        END;
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_counts_after_insert`);
      console.log("in creating update_counts_after_insert trigger -> \n",err);
    }

    // Create trigger for UPDATE
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_counts_after_update
          AFTER UPDATE ON followers
          FOR EACH ROW
          BEGIN

              -- Check if the isAccepted is true
              IF NEW.isAccepted = 1 THEN

                  -- Increment following_count for the user being followed
                  UPDATE users 
                  SET followings_count = followings_count + 1
                  WHERE id = NEW.followerId;

                  -- Increment followers_count for the user who is following
                  UPDATE users 
                  SET followers_count = followers_count + 1
                  WHERE id = NEw.followingId;
              END IF;
          END
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_counts_after_update`);
      console.log("in creating update_counts_after_update trigger -> \n",err);
    }
  
    // Create trigger for DELETE
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_counts_after_delete
          AFTER DELETE ON followers
          FOR EACH ROW
          BEGIN

              -- Check if the isAccepted is true
              IF OLD.isAccepted = 1 THEN
                  -- decrement following_count for the user being followed
                  UPDATE users 
                  SET followings_count = followings_count - 1
                  WHERE id = OLD.followerId;

                  -- Increment followers_count for the user who is following
                  UPDATE users 
                  SET followers_count = followers_count - 1
                  WHERE id = OLD.followingId;
              END IF;
          END
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_counts_after_delete`);
      console.log("in creating update_counts_after_delete trigger -> \n",err);
    }


    // trigger to update count of likes_count in posts table
    // Create trigger for INSERT
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_likes_count_after_insert
          AFTER INSERT ON posts_likes
          FOR EACH ROW
          BEGIN
            UPDATE posts
            SET likes_count = likes_count + 1
            WHERE id = NEW.postId;
          END
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_likes_count_after_insert`);
      console.log("in creating update_likes_count_after_insert trigger -> \n",err);
    }

    // Create trigger for DELETE
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_likes_count_after_delete    
          AFTER DELETE ON posts_likes
          FOR EACH ROW
          BEGIN
            UPDATE posts
            SET likes_count = likes_count - 1
            WHERE id = OLD.postId;
          END    
      `)     
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_likes_count_after_delete`);
      console.log("in creating update_likes_count_after_delete trigger -> \n",err);
    }
    
    
    // trigger to update count of comments in posts table
    // Create trigger for INSERT
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_comments_count_after_insert
          AFTER INSERT ON posts_comments
          FOR EACH ROW
          BEGIN
            UPDATE posts
            SET comments_count = comments_count + 1
            WHERE id = NEW.postId;
          END
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_comments_count_after_insert`);
      console.log("in creating update_comments_count_after_insert trigger -> \n",err);
    }

    // Create trigger for DELETE
    try{
      await this.dataSource.query(`
          CREATE TRIGGER IF NOT EXISTS update_comments_count_after_delete
          AFTER DELETE ON posts_comments
          FOR EACH ROW
          BEGIN
            UPDATE posts
            SET comments_count = comments_count - 1
            WHERE id = OLD.postId;
          END
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_comments_count_after_delete`);
      console.log("In creating update_comments_count_after_delete trigger -> \n", err);
    }

    // trigger to update count of shares in posts table
    // Create trigger for INSERT
    try{
      await this.dataSource.query(`
        CREATE TRIGGER IF NOT EXISTS update_shares_count_after_insert
        AFTER INSERT ON posts_shares
        FOR EACH ROW
        BEGIN
          UPDATE posts
          SET shares_count = shares_count + 1
          WHERE id = NEW.postId;
        END
      `);
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXISTS update_shares_count_after_insert`);
      console.log("In creating update_shares_count_after_insert trigger -> \n", err);
    }

    // Create trigger for DELETE
    try{
      await this.dataSource.query(`
        CREATE TRIGGER IF NOT EXISTS update_shares_count_after_delete
        AFTER DELETE ON posts_shares
        FOR EACH ROW
        BEGIN
          UPDATE posts
          SET shares_count = shares_count - 1
          WHERE id = OLD.postId;
        END
      `)
    }catch(err){
      await this.dataSource.query(`DROP TRIGGER IF EXITSTS update_shares_count_after_delete`);
      console.log("In creating update_shares_count_after_delete trigger -> \n", err);
    }
  }
}


