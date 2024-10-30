import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {

    @Transform(({ value }) => String(value)?.trim())
    content?: string;

    files?: File[]
}