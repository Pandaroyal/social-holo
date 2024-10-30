import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';
import { GetUser } from '../decorators/getUser.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, private cloudinaryService: CloudinaryService) {}
  
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(@Body() createPostDto: CreatePostDto, @UploadedFiles() files: Express.Multer.File[], @GetUser() user: any): Promise<any> {
    let results = [];
    if(files && files.length > 0) {
      results = await this.cloudinaryService.uploadImages(files);
    }
    return this.postsService.create(createPostDto, results, user);
  }
  
  @Get()
  findAll(@GetUser() user: any) {
    return this.postsService.findAll(user.id);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.postsService.findOne(id, user.id);
  }

  @Get('user/:id')
  findUserPosts(@Param('id') id: string, @GetUser() user: any) {
    return this.postsService.findUserPosts(id, user.id);
  }

  @Post('like/:id')
  like(@Param('id') id: string, @GetUser() user: any) {
    return this.postsService.like(id, user);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string, @Query() query: { parentCommentId: string}) {
    return this.postsService.getComments(id, query.parentCommentId);
  }

  @Post(':id/comment')
  @UseInterceptors(FileInterceptor(''))  
  addComment(@Param('id') id: string, @Body() body: CreateCommentDto, @GetUser() user: any) {
    console.log("id -> ", user);
    return this.postsService.addComment(id, user, body);
  }

  @Get('bin')
  getDeletedFiles(@GetUser() user: any) {
    console.log("get Deleted Files -> ");
    return this.postsService.getDeletedFiles(user.id);
  }

  // Update the post
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Patch('/restore/:id')
  restore(@Param('id') id: string){
    return this.postsService.restore(id);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
  
}
