import { PartialType } from '@nestjs/mapped-types';
import { Users } from '../../entities/users.entity';

export class UpdateUserDto extends PartialType(Users) {}
