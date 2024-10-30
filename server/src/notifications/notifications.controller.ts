import { Controller, Delete, Get, Param, Patch, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { GetUser } from "../decorators/getUser.decorator";

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    findAll(@GetUser() user: any) {
        return this.notificationsService.findAll(user.id);
    }

    @Patch('read/:id')
    read(@Param('id') id: any) {
        this.notificationsService.read(id);
    }

    @Patch('mark-as-read-all')
    markAsReadAll(@GetUser() user: any) {
        this.notificationsService.markAsReadAll(user.id);
    }

    @Delete('delete')
    delete(@Query() query: any) {
        this.notificationsService.delete(query.id);
    }

    @Delete('delete-all')
    deleteAll(@GetUser() user: any) {
        this.notificationsService.deleteAll(user.id);
    }
}   
