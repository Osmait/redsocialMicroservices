import { Module } from '@nestjs/common';
import { FollowerController } from './controller/follower.controller';
import { FollowerService } from './service/follower.service';
import { Follower } from './domain/follower';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Follower])],
  controllers: [FollowerController],
  providers: [FollowerService],
  exports: [TypeOrmModule],
})
export class FollowerModule {}
