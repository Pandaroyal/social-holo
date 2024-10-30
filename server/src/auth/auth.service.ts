import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup-dto';
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if(!user){
      throw new UnauthorizedException('Incorrect Email');
    }
    if( !await compare(password, user.password)){
      throw new UnauthorizedException('Incorrect Password');
    }
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user
    };
  }

  signup(newUser: SignupDto) {
    return this.usersService.create(newUser);
  }
}
