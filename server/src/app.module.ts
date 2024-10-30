import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { MulterServiceModule } from './frameworks/multerService.module';
import { DatabaseServiceModule } from './frameworks/databaseService.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CloudinaryService } from './cloudinary.service';
import SettingsModule from './settings/settings.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        ScheduleModule.forRoot(),
        MulterServiceModule,
        DatabaseServiceModule,
        UsersModule,
        PostsModule,
        AuthModule,
        NotificationsModule,
        SettingsModule        
    ],
    controllers:[AppController],
    providers: [AppService, CloudinaryService],
})

export class AppModule {}