import { IsNotEmpty } from "class-validator";


export class CreatePostMediaDto { 

    @IsNotEmpty()
    secure_url!: string

    @IsNotEmpty()
    width!: number

    @IsNotEmpty()
    height!: number

    @IsNotEmpty()
    format!: string 
}