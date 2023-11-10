import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { In, Repository } from 'typeorm';

import { HttpService } from '@nestjs/axios';
import { PostResponse, User } from '../domain/postDto';
import { lastValueFrom, map } from 'rxjs';
import { randomUUID } from 'crypto';

const COMMENT_URL = 'http://comment-service:8000';
const FOLLOWER_URL = 'http://follower-service:3001';
@Injectable()
export class PostService {
  private header = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly httpService: HttpService,
  ) {}

  created(post: Post) {
    post.id = randomUUID();

    try {
      this.postRepository.save(post);
    } catch (err) {
      throw new InternalServerErrorException('Error Creating Post');
    }
  }
  async findById(id: string, token: string) {
    this.header.headers.Authorization = `Bearer ${token}`;
    const post = await this.postRepository.findOne({
      where: { id },
    });
    const comment = await lastValueFrom(
      this.httpService
        .get(`${COMMENT_URL}/comment/${post.id}`, this.header)
        .pipe(map((res) => res.data)),
    );

    const postR = new PostResponse(post, comment);
    return postR;
  }

  public async getFeed(userId: string, token: string, s: number, t: number) {
    this.header.headers.Authorization = `Bearer ${token}`;
    try {
      const Ids = await this.getFollower(userId);
      Ids.push(userId);

      const [postlist, total] = await this.postRepository.findAndCount({
        where: { userId: In(Ids) },
        order: {
          createdAt: 'DESC',
        },
        skip: s,
        take: t,
      });

      return {
        post: await this.postResponseFetchComment(postlist),
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error doing request');
    }
  }

  public async findAll(userId: string, token: string) {
    this.header.headers.Authorization = `Bearer ${token}`;
    const postList = await this.postRepository.find({
      where: { userId, deleted: false },
      order: {
        createdAt: 'DESC',
      },
    });
    return await this.postResponseFetchComment(postList);
  }

  public async delete(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`post with ${id} dont exist`);
    }
    post.deleted = true;
    this.postRepository.save(post);
  }

  public async postResponseFetchComment(
    postList: Post[],
  ): Promise<PostResponse[]> {
    const postReponse: PostResponse[] = [];

    for (const post of postList) {
      try {
        const comment = await lastValueFrom(
          this.httpService
            .get(`${COMMENT_URL}/comment/${post.id}`, this.header)
            .pipe(map((res) => res.data)),
        );

        const postR = new PostResponse(post, comment);
        postReponse.push(postR);
      } catch (error) {
        throw new InternalServerErrorException('Error doing request');
      }
    }
    return postReponse;
  }

  public async getFollower(userId: string) {
    const follower: User[] = await lastValueFrom(
      this.httpService
        .get(`${FOLLOWER_URL}/following/${userId}`, this.header)
        .pipe(map((res) => res.data)),
    );
    const Ids = follower.map((user) => user.id);
    return Ids;
  }
}
