import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
    providers: [NotificationsGateway, NotificationsService],
    exports: [NotificationsGateway],
    controllers: [NotificationsController]
})

export class NotificationsModule{}