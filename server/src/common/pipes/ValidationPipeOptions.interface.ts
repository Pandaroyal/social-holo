import { ValidationError } from 'class-validator';

export interface ValidationPipeOptions{
    transform?: boolean;
    disableErrorMessage?: boolean;
    exceptionFactory?: (errors: ValidationError[]) => any;
}