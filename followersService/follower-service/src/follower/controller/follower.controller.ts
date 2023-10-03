import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FollowerService } from '../service/follower.service';
import { Follower } from '../domain/follower';

@Controller('/')
export class FollowerController {
  constructor(private followerService: FollowerService) {}

  @Post('follower/')
  public createdfollower(@Body() follower: Follower) {
    console.log(follower);
    this.followerService.follow(follower);
  }

  @Get('following/:id')
  public getfollowing(@Param('id') id: string) {
    return this.followerService.getfollowing(id);
  }

  @Get('follower/:id')
  public getfollowers(@Param('id') id: string) {
    return this.followerService.getfollowers(id);
  }
  @Delete('/unfollow')
  public unFollow(@Body() follower: Follower) {
    this.followerService.unFollow(follower);
  }
}
