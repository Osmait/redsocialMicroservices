import { Controller, Get } from '@nestjs/common';

@Controller('post')
export class PostController {
  @Get('/')
  public getPost() {
    return 'listPost';
  }
}
