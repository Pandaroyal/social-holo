import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () =>{
    console.log("Public decorator");
    return SetMetadata(IS_PUBLIC_KEY, true);
} 