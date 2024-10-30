import { IsNotEmpty } from 'class-validator';
import { NotificationType } from '../../entities/notifications.entity';
export class CreateNotificationsDto {

    @IsNotEmpty()
    recipientId!: string;

    postId?: string;

    @IsNotEmpty()
    actorId!: string;

    @IsNotEmpty()
    type!: NotificationType;

    comment?: string;
}