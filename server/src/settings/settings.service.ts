import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, ManyToMany, Repository } from 'typeorm'
import { Settings } from '../entities/settings.entity'
import { NotificationsSettings } from '../entities/notifications_settings.entity'
import { NotificationsSettingsDto } from './dto/notificationSettings.dto'

@Injectable()
export class SettingsService{
    constructor(
        @InjectRepository(Settings)
        private settingsRepository: Repository<Settings>,
        private dataSource: DataSource
    ){}

    async toggleNotification(isNotificationsOn: string, userId: string){
        try{
            const isNotificationsOnBoolean = isNotificationsOn === 'false' ? false : true;
            return await this.settingsRepository.update({userId}, {isNotificationsOn: isNotificationsOnBoolean});
        }catch(err){
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async updateNotificationsSettings(data: NotificationsSettingsDto, userId: string){
        try{
            await this.dataSource.transaction( async manager => {
                const settings = await manager.findOne(Settings, {where: {userId}})
                return await manager.update(NotificationsSettings, {id: settings?.notificationsSettingsId}, data);
            });
        }catch(err){
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}