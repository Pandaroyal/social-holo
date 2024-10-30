import { Body, Controller, Param, Patch } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { GetUser } from "../decorators/getUser.decorator";
import { NotificationsSettingsDto } from "./dto/notificationSettings.dto";
import { UpdateResult } from "typeorm";


@Controller('settings')
export class SettingsController{
    constructor(
        private settingsService: SettingsService
    ){}

    @Patch('update-notifications-settings')
    updateNotificationsSettings(@Body() data: NotificationsSettingsDto, @GetUser() user: any){
        return this.settingsService.updateNotificationsSettings(data, user.id);
    }

    @Patch('toggle-notification/:isNotificationsOn')
    toggleNotification(@Param('isNotificationsOn') isNotificationsOn: string, @GetUser() user: any){
        return this.settingsService.toggleNotification(isNotificationsOn, user.id);
    }
}