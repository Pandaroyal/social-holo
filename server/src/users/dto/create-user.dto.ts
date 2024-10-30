import { Exclude, Transform} from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsEmail, isString} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Transform(({ value }) => String(value)?.trim())
    @IsNotEmpty()
    name!: string;

    @IsString()
    @Transform(({ value }) => String(value)?.trim().toLowerCase())
    @IsNotEmpty()
    username!: string;

    @IsEmail()
    @Transform(({ value }) => String(value)?.trim())
    @IsNotEmpty()
    email!: string;

    @IsString()
    @Transform(({ value }) => String(value)?.trim())
    @IsNotEmpty()
    @Exclude()
    password!: string;
}
