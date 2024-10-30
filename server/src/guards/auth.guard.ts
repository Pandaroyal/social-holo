import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService, private usersService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic){
            return true;
        } 
            
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['token'];
        console.log("token -> ", token);
        if(!token){
          return false;
        }

        try {
          const payload = this.jwtService.verify(token);
          request.user = await this.usersService.findOne(payload.sub, payload.sub);
          console.log("token verified");
          return true; // Token is valid
        } catch (error: any) {
          if (error.name === 'TokenExpiredError') {
            return false;// Handle expired token
          }
          console.log("error -> ", error);
          return false; // Handle other errors
        }
    }

    // extractTokenFromHeader(req: Request): string | undefined {
    //     const [type, token] = req.headers.authorization?.split(' ') ?? [];
    //     return type === 'Bearer' ? token : undefined;
    // }
}