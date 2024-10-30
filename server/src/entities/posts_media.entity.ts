import {Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity} from "typeorm";
import { Posts } from "./posts.entity";

@Entity()
export class PostsMedia {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    postId!: string;

    @Column()
    url!: string;

    @Column()
    width!: number;

    @Column()
    height!: number;

    @Column({default: 0})
    format!: string

    @CreateDateColumn()
    createdAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })  // Use postId as the foreign key column
    post!: Posts;
}