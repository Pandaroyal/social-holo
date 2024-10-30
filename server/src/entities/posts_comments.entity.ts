import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Posts } from "./posts.entity";
import { Users } from "./users.entity";


@Entity()
export class PostsComments {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    postId!: string

    @Column()
    commenterId!: string

    @Column({default: null})
    parentCommentId!: string

    @Column()
    content!: string

    @CreateDateColumn()
    createdAt!: Date

    @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })  // Use postId as the foreign key column
    post!: Posts

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commenterId' })  // Use UserId as the foreign key column
    user!: Users

    @ManyToOne(() => PostsComments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentCommentId' })  // Use UserId as the foreign key column
    parent_comment!: PostsComments
}