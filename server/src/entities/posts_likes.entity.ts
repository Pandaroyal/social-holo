import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Posts } from "./posts.entity";


@Entity()
export class PostsLikes {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    postId!: string;

    @Column()
    userId!: string

    @CreateDateColumn()
    createdAt!: Date
    
    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })  // Use UserId as the foreign key column
    user!: Users

    @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })  // Use postId as the foreign key column
    post!: Posts
}