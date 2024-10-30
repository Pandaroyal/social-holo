import { MulterModule } from '@nestjs/platform-express'
import { MulterConfigService } from '../config/multer.config'
import { Module } from '@nestjs/common'

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService
        })
    ],
    exports: [MulterModule]
})

export class MulterServiceModule {}
