import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { Post as PostModel } from '../domain/post.entity';
import { ClientProxy } from '@nestjs/microservices';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    @Inject('POST') private readonly client: ClientProxy,
  ) {}

  @Get('/:id')
  public getPost(@Param('id') id: string, @Query('comment') comment: string) {
    console.log(comment);
    return this.postService.findAll(id);
  }

  @Post('/')
  public createdPost(@Body() post: PostModel, @Req() request: Request) {
    this.client.emit('new-Post', post.content);
    const userId = request.headers['user'];
    post.userId = userId;
    this.postService.created(post);
  }

  @Delete('/:id')
  public deletePost(@Param('id') id: string) {
    this.postService.delete(id);
  }
}
