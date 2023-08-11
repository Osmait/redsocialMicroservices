import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
