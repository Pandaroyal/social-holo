import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Settings } from "./settings.entity";

@Entity()
export class NotificationsSettings {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({default: true})
    follows!: boolean

    @Column({default: true})
    requests!: boolean

    @Column({default: true})
    accepts!: boolean

    @Column({default: true})
    addPosts!: boolean

    @Column({default: true})
    likes!: boolean

    @Column({default: true})
    comments!: boolean

    @Column({default: true})
    shares!: boolean
    
    @Column({default: true})
    replies!: boolean
}