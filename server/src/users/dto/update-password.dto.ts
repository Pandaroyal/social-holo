import { Exclude, Transform} from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsEmail, isString} from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @Transform(({ value }) => String(value)?.trim())
    @IsNotEmpty()
    password!: string;

    @IsString()
    @Transform(({ value }) => String(value)?.trim())
    @IsNotEmpty()
    new_password!: string;
}
