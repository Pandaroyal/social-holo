import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { NotificationsSettings } from "./notifications_settings.entity";

type Theme = 'light' | 'dark'

@Entity()
export class Settings {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    userId!: string

    @Column({
        type: 'varchar',
        default: 'dark'
    })
    theme!: Theme

    @Column({default: 'default'})
    language!: string

    @Column({default: true})
    isNotificationsOn!: boolean
    
    @Column()
    notificationsSettingsId!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    // Define the relationship
    @OneToOne(() => NotificationsSettings, { cascade: true }) // Optional: use cascade if you want to save notifications settings automatically when saving settings
    @JoinColumn({ name: 'notificationsSettingsId' })
    notificationsSettings!: NotificationsSettings; // This creates a foreign key relation
}