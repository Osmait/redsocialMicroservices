import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower, User } from '../domain/follower';
import { Repository } from 'typeorm';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FollowerService {
  header = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    @InjectRepository(Follower)
    private followerRepository: Repository<Follower>,
    private readonly httpService: HttpService,
  ) {}
  public follow(follower: Follower) {
    this.followerRepository.save(follower);
  }
  public getfollowing(id: string) {
    return this.followerRepository.find({
      where: { followerId: id },
    });
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
            .get(
              `http://127.0.0.1:8080/user/${follower.followerId}`,
              this.header,
            )
            .pipe(map((res) => res.data)),
        );
        listUSer.push(follow);
      } catch (error) {
        console.log(error);
      }
    }
    return listUSer;
  }
}
