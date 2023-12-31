import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower, User } from '../domain/follower';
import { Repository } from 'typeorm';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';

export const USER_URL = 'http://user-service:8080';

@Injectable()
export class FollowerService {
  header = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    @InjectRepository(Follower)
    private followerRepository: Repository<Follower>,
    private readonly httpService: HttpService,
    @Inject('FOLLOW') private readonly client: ClientProxy,
  ) {}
  public follow(follower: Follower) {
    this.client.emit('new-follow', follower);
    this.followerRepository.save(follower);
  }
  public async getfollowing(id: string) {
    const listFollowing = await this.followerRepository.find({
      where: { followerId: id },
    });
    const listUSer: User[] = [];
    for (const follower of listFollowing) {
      try {
        const follow: User = await lastValueFrom(
          this.httpService
            .get(`${USER_URL}/user/${follower.followingId}`, this.header)
            .pipe(map((res) => res.data)),
        );
        listUSer.push(follow);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
    return listUSer;
  }
  public async getfollowers(id: string) {
    const listFollowers: Follower[] = await this.followerRepository.find({
      where: { followingId: id },
    });
    const listUSer: User[] = [];
    for (const follower of listFollowers) {
      try {
        const follow: User = await lastValueFrom(
          this.httpService
            .get(`${USER_URL}/user/${follower.followerId}`, this.header)
            .pipe(map((res) => res.data)),
        );
        listUSer.push(follow);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
    return listUSer;
  }

  public async unFollow(follower: Follower) {
    this.followerRepository.delete(follower);
  }
}
