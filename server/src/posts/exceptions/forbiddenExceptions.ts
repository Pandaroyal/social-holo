import { HttpStatus, HttpException } from "@nestjs/common";

export class ForbiddeException extends HttpException {
    constructor(){
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}