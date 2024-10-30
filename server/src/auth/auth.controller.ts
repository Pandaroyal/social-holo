import { Controller, Get, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { Public } from '../decorators/public.decorator';
import { Response } from 'express';
import { GetUser } from '../decorators/getUser.decorator';
import { SignupDto } from './dto/signup-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.signIn(signInDto.email, signInDto.password);
    response.cookie('token', result.access_token, { httpOnly: true });
    return result.user;
  }

  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDto: SignupDto) {
    return this.authService.signup(signUpDto);
  }

  @Get('/me')
  getProfile(@GetUser() user: any) {
    console.log('user -> ',user);
    return user;
  }

  @Get('/logout')
  logout(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return 'Logged out';
  }

}
