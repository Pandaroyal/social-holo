import { App } from '../interface/app.interface';
export class CreateAppDto implements App {
    name!: string;
    description!: string;
}