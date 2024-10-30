import { IsNotEmpty } from "class-validator";

export class NotificationsSettingsDto{
    @IsNotEmpty()
    follows!: boolean;

    @IsNotEmpty()
    requests!: boolean;
    
    @IsNotEmpty()
    accepts!: boolean;
    
    @IsNotEmpty()
    addPosts!: boolean;

    @IsNotEmpty()
    likes!: boolean

    @IsNotEmpty()
    comments!: boolean

    @IsNotEmpty()
    replies!: boolean

    @IsNotEmpty()
    shares!: boolean

}