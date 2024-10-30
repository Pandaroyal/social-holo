import { Injectable } from '@nestjs/common';
import { DataSource, LessThan, MoreThan } from 'typeorm';
import { CreateNotificationsDto } from './dto/createNotifications.dto';
import { Notifications } from '../entities/notifications.entity';
import { NotificationsDto } from './dto/notifications.dto';

@Injectable()
export class NotificationsService {
    constructor(
        private dataSource: DataSource, 
    ) {}

    async createNotification(notification: CreateNotificationsDto, option?: any) {
        return this.dataSource.getRepository(Notifications).save(notification);
    }

    async findAll(recipientId: string) {
        const notificationsRepository = this.dataSource.getRepository(Notifications);
        const notifications = await notificationsRepository.find({
            where: { recipientId },
            order: { createdAt: 'DESC' }
        });
        const unreadCount  = await notificationsRepository.count({
            where: { recipientId, readAt: false }
        });
        return { notifications, unreadCount };
    }

    read(id: string) {
        return this.dataSource.getRepository(Notifications).update({ id }, { readAt: true });
    }

    markAsReadAll(recipientId: string) {
        return this.dataSource.getRepository(Notifications).update({ recipientId }, { readAt: true });
    }

    async deleteNotifications(data: NotificationsDto){
        return this.dataSource.transaction( async manager => {
            const entitiesToRemove = await manager.find(Notifications, { where: data });
                    
            if (entitiesToRemove.length > 0) {
              // Remove the found entities
              return await manager.remove(Notifications, entitiesToRemove);
            }
        })
    }

    delete(id: string) {
        return this.dataSource.getRepository(Notifications).delete({ id });
    }

    deleteAll(recipientId: string) {
        return this.dataSource.getRepository(Notifications).delete({ recipientId });
    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    // handleCron() {
    //     const date = new Date();
    //     date.setMinutes(date.getMinutes() - 5);
    //     this.dataSource.getRepository(Notifications).delete({ createdAt: LessThan(date) });
    // }
}