import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn, JoinColumn } from "typeorm";
import { Users } from "./users.entity";
import { Posts } from "./posts.entity";

export enum NotificationType {
    FOLLOW = 'follow',
    REQUEST = 'request',
    ACCEPT = 'accept',
    POST_ADDED = 'post-added',
    LIKE = 'like',
    COMMENT = 'comment',
    REPLY = 'reply',
    SHARE = 'share',
}

@Entity()
export class Notifications {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // Unique identifier for the notification

    @Column()
    recipientId!: string; // The ID of the recipient of the notification
    
    @Column()
    actorId!: string;

    @Column({default: null})
    postId!: string;

    @Column()
    type!: NotificationType; // Type of notification, e.g., 'like', 'comment', etc. 

    @Column({default: false})
    readAt!: boolean;

    @Column({default: null})
    comment!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipientId' })  // Use UserId as the foreign key column
    users!: Users;
    
    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'actorId' })  // Use UserId as the foreign key column
    user!: Users;

    @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })  // Use postId as the foreign key column
    post!: string;
}



