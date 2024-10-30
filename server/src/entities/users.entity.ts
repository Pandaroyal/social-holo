import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { Exclude } from "class-transformer"


export enum AccountType {
    PUBLIC = 'public',
    PRIVATE = 'private'
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    name!: string

    @Column({unique: true})
    username!: string

    @Column({unique: true})
    email!: string

    @Column()
    @Exclude()
    password!: string

    @Column({
        type: 'enum',  // Set the type to 'enum'
        enum: AccountType,  // Reference the enum you created
        default: AccountType.PUBLIC,  // Set default value from the enum
    })
    account_type!: AccountType;

    @Column({default: 'I am new to this site!'})
    bio!: string

    @Column({default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'})
    avatar!: string

    @Column({default: 0})
    posts_count!: number

    @Column({default: 0})
    followers_count!: number

    @Column({default: 0})
    followings_count!: number 
    
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null
}