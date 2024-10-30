import { Injectable } from "@nestjs/common";
import { CreateAppDto } from "./dto/create-app.dto";
import { UpdateAppDto } from "./dto/update-app.dto";
import { DataSource } from "typeorm";
import { Users } from "./entities/users.entity";
import { Settings } from "./entities/settings.entity";
import { NotificationsSettings } from "./entities/notifications_settings.entity";
@Injectable()
export class AppService {
    constructor(
        private dataSource: DataSource, 
    ) {}

    getHello(): string {
        return "Hello Duniya";
    }

    create(body: CreateAppDto): string {
        return `${JSON.stringify(body)} is created`
    }

    update(id: string, body: UpdateAppDto): string {
        return `On ${id}, ${JSON.stringify(body)} is updated`
    }

    delete(id: number): string {
        return `this is a delete request's response whose id is ${id}`;
    }


    assignSettings() {
        try{
            return this.dataSource.transaction(async manager => {
                const users = await manager.find(Users);
                for(let user of users) {
                    const settings = new Settings();
                    settings.userId = user.id;
                    settings.notificationsSettings = new NotificationsSettings(); // This will create a new NotificationsSettings instance
                    await manager.save(settings);
                }
                return "Assigned Successfully";
            })
        }catch(err) {
            console.log(err);
        }
    }
}