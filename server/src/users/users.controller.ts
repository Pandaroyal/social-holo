import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, HttpException, HttpStatus, ValidationPipe, BadRequestException, UseInterceptors, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DtoValidationPipe } from './pipes/dtoValidationPipe';
import { ValidationPipeOptions } from '../common/pipes/ValidationPipeOptions.interface';
import { Users } from '../entities/users.entity';
import { UserInterceptor } from './users.interceptor';
import { Public } from '../decorators/public.decorator';
import { GetUser } from '../decorators/getUser.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body(new DtoValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('change-password')
  changePassword(@Body() data: UpdatePasswordDto, @GetUser() user: any) {
    console.log("change password", data);
    return this.usersService.changePassword(data, user.id);
  }

  @Post('follow/:id')
  follow(@Param('id') id: string, @GetUser() user: any) {
    return this.usersService.follow(id, user);
  }

  @Patch('request-accepted/:requestId')
  followRequestAccepted(@Param('requestId') id: string, @GetUser() user: any) {
    return this.usersService.followRequestAccepted(id, user);
  }

  @Delete('unfollow/:requestId')
  unfollow(@Param('requestId') id: string) {
    return this.usersService.unfollow(id);
  }

  @Patch('account-type')
  switchAccountType(@GetUser() user: any) {
    return this.usersService.switchAccountType(user);
  }

  @Get('/followers/:followerId')
  allFollowers(@Param('followerId') followerId: string, @GetUser() user: any,@Query('search') search?: string) {
    return this.usersService.allFollowers(followerId, user.id, search);
  }

  @Get('/following/:followingId')
  allFollowing(@Param('followingId') followingId: string, @GetUser() user: any,@Query('search') search?: string) {
    return this.usersService.allFollowing(followingId, user.id, search);
  }

  @Get('/search')
  searchUser(@Query('search') search: string, @GetUser() user: any) {
    return this.usersService.searchUser(search, user.id);
  }

  @Get('/requests')
  getRequests(@GetUser() user: any) {
    return this.usersService.getRequests(user.id);
  }

  @Public()
  @Get()
  @UseInterceptors(new UserInterceptor<CreateUserDto>(CreateUserDto))
  async findAll(): Promise<Users[]> {
    try{
      return this.usersService.findAll();
    }catch(error){
      throw new HttpException(
        {
          status: 403,
          message: 'Error in findAll() method in UsersController created by me'
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error
        }
      )
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.usersService.findOne(id, user.id);
  }

  @UsePipes(new ValidationPipe({
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === 'production',
        exceptionFactory: () => new BadRequestException('Validation Failed'),
      } as ValidationPipeOptions),
    )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('restore/:id')
  restore(@Param('id') id: string){
    return this.usersService.restore(id);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
