import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn, JoinColumn } from "typeorm";
import { Users } from "./users.entity";
import { CONFIGURABLE_MODULE_ID } from "@nestjs/common/module-utils/constants";

@Entity()
export class Followers {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // Unique identifier for the notification

    @Column()
    followerId!: string;

    @Column()
    followingId!: string;

    @Column({default: false})
    isAccepted!: boolean

    @CreateDateColumn()
    createdAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followerId' })  // Use UserId as the foreign key column
    users!: Users;
    
    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followingId' })  // Use UserId as the foreign key column
    user!: Users;

}

