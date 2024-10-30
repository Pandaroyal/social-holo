import { IsNotEmpty } from 'class-validator';
import { NotificationType } from '../../entities/notifications.entity';
export class NotificationsDto {

    postId?: string;

    @IsNotEmpty()
    actorId!: string;

    @IsNotEmpty()
    type!: NotificationType;

    comment?: string;
}