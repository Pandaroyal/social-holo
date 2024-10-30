import { Controller, Get, Query, Post, Body, Put, Param, Delete, UploadedFiles, UseInterceptors, Res, BadRequestException } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { AppService } from './app.service';
import { Response } from 'express'
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from './decorators/public.decorator';
import { CloudinaryService } from './cloudinary.service';

@Public()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private cloudinaryService: CloudinaryService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  create(@Body() body: CreateAppDto): string {
    return this.appService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateAppDto): string {
    return this.appService.update(id, body);
  }

  @Delete()
  delete(@Query() query: any): string {
    return this.appService.delete(query.id);
  }

  @Public()
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    let results = []
    console.log("upload file", files);
    if (files && files.length > 0) {
      results = await this.cloudinaryService.uploadImages(files);
    }
    console.log("results", results);
    return results;
  }

  @Get('/test-cookie')
  testCookie(@Res({passthrough: true}) res: Response) {
    res.cookie('key', 'value', { httpOnly: true })
    return "cookie set"
  }


  @Get('assign-settings')
  assignSettings() {
    return this.appService.assignSettings();
  }
}
