import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { UsersSubscriber } from './Subscribers/users.subscriber';
import { TriggerService } from './trigger.services';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber, TriggerService],
  exports: [UsersService]
})
export class UsersModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
