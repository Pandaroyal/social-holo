import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Users } from "../entities/users.entity";
import { Posts } from "../entities/posts.entity";
import { Notifications } from "../entities/notifications.entity";
import { Followers } from "../entities/followers.entity";
import { PostsMedia } from "../entities/posts_media.entity";
import { PostsLikes } from "../entities/posts_likes.entity";
import { PostsComments } from "../entities/posts_comments.entity";
import { PostsShares } from "../entities/posts_shares.entity";
import { Settings } from "../entities/settings.entity";
import { NotificationsSettings } from "../entities/notifications_settings.entity";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: this.configService.get<'aurora-mysql' | undefined>('DATABASE_TYPE'),
            host: this.configService.get('DATABASE_HOST'),
            port: +this.configService.get('DATABASE_PORT'),
            username: this.configService.get('DATABASE_USER'),
            password: this.configService.get<string | undefined>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_DB'),
            entities: [ Users, Followers, Posts, PostsMedia, PostsLikes, PostsComments, PostsShares, Notifications, Settings, NotificationsSettings ],
            synchronize: true
        }    
    }
}
