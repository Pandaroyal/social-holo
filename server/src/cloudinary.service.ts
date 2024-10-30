import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImages(files: any): Promise<any[]> {
    const uploadResults = [];
    for (const file of files) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'social_holo', resource_type: 'auto' }, // Specify folder and auto-detect type
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer); // Pass the buffer to Cloudinary
        });
  
        uploadResults.push(result);
      } catch (error) {
        throw new BadRequestException(`File ${file.originalname} failed to upload`);
      }
    }

    console.log("before return ->");
    // Wait for all uploads to complete
    return uploadResults;
  }
}
