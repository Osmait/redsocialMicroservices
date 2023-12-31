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
import { PostWithFollower } from '../domain/postDto';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    @Inject('POST')
    private readonly client: ClientProxy,
  ) {}

  @Get('/:id')
  public getPost(
    @Param('id') id: string,
    @Query('comment') comment: string,
    @Req() request: Request,
  ) {
    const token = request.headers['token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.postService.findAll(id, token);
  }

  @Post('/')
  public async createdPost(@Body() post: PostModel, @Req() request: Request) {
    const userId = request.headers['user'];
    if (!userId) {
      throw new UnauthorizedException();
    }
    post.userId = userId;
    this.postService.created(post);

    const followers = await this.postService.getFollower(userId);

    const postWithFollower: PostWithFollower = {
      post,
      followers,
    };
    this.client.emit('new-Post', postWithFollower);
  }

  @Delete('/:id')
  public deletePost(@Param('id') id: string) {
    this.postService.delete(id);
  }

  @Get('/feed/:id')
  public getfeed(
    @Param('id') id: string,
    @Req() request: Request,
    @Query('page')
    page: number,
    @Query('limit')
    limit: number,
  ) {
    const token = request.headers['token'];

    if (!token) {
      throw new UnauthorizedException();
    }
    return this.postService.getFeed(id, token, page, limit);
  }

  @Get('/one/:id')
  public findPostById(@Param('id') id: string, @Req() request: Request) {
    const token = request.headers['token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.postService.findById(id, token);
  }
}
