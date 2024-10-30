import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import { Posts } from "../../entities/posts.entity";

@Injectable()
export class DtoValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if(!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(Posts, value);
        const errors = await validate(object);
        if(errors.length > 0) {
            throw new BadRequestException(`Body sahi nahi hai yaar ${errors}`);
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}