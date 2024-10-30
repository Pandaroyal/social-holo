import { Module, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Posts } from '../entities/posts.entity'
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryService } from '../cloudinary.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), NotificationsModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService],
  exports: [PostsService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('posts');
  }
}
