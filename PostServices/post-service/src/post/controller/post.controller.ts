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
  UnauthorizedException,
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
  public getPost(
    @Param('id') id: string,
    @Query('comment') comment: string,
    @Req() request: Request,
  ) {
    console.log(comment);
    const token = request.headers['token'];
    const userId = request.headers['user'];
    console.log(token);
    console.log(userId);
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.postService.findAll(id, token);
  }

  @Post('/')
  public createdPost(@Body() post: PostModel, @Req() request: Request) {
    const userId = request.headers['user'];
    if (!userId) {
      throw new UnauthorizedException();
    }
    post.userId = userId;
    this.postService.created(post);

    this.client.emit('new-Post', post);
  }

  @Delete('/:id')
  public deletePost(@Param('id') id: string) {
    this.postService.delete(id);
  }

  @Get('/feed/:id')
  public getfeed(
    @Param('id') id: string,

    @Req() request: Request,
  ) {
    const token = request.headers['token'];
    // const userId = request.headers['user'];

    if (!token) {
      throw new UnauthorizedException();
    }
    return this.postService.getFeed(id, token);
  }
}
