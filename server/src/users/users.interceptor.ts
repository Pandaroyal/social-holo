import { NestInterceptor, ExecutionContext, CallHandler, Injectable} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { plainToClass } from "class-transformer";



export class UserInterceptor<T> implements NestInterceptor{
    constructor(private readonly dtoClass: new () => T ){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map( (data) => {
                return plainToClass(this.dtoClass, data);
            })
        )
    }
}