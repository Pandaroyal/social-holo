import { memoryStorage } from "multer";
import { MulterOptionsFactory, MulterModuleOptions } from "@nestjs/platform-express";
export class MulterConfigService implements MulterOptionsFactory {

    createMulterOptions(): MulterModuleOptions { 
        return {
            storage: memoryStorage(),
        }
    }
}