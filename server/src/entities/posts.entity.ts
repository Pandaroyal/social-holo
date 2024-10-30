import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Users } from "./users.entity"

@Entity()
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({default: null})
    content!: string;
    
    @Column()
    creatorId!: string;

    @Column({default: 0})
    likes_count!: string;

    @Column({default: 0})
    comments_count!: string;

    @Column({default: 0})
    shares_count!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creatorId' })  // Use UserId as the foreign key column
    user!: Users
}
