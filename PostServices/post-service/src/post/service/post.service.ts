import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { PostResponse, User } from '../domain/postDto';
import { lastValueFrom, map } from 'rxjs';

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
    console.log(post);

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

  public async getFeed(userId: string, token: string) {
    this.header.headers.Authorization = `Bearer ${token}`;
    try {
      const follower: User[] = await lastValueFrom(
        this.httpService
          .get(`${FOLLOWER_URL}/following/${userId}`, this.header)
          .pipe(map((res) => res.data)),
      );
      const Ids = follower.map((user) => user.id);
      Ids.push(userId);
      const postlist = await this.postRepository.find({
        where: { userId: In(Ids) },
        order: {
          createdAt: 'DESC',
        },
      });
      return await this.postResponseFetchComment(postlist);
    } catch (error) {
      console.log(error);
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

  private async postResponseFetchComment(
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
        .get(`${FOLLOWER_URL}/follower/${userId}`, this.header)
        .pipe(map((res) => res.data)),
    );
    const Ids = follower.map((user) => user.id);
    return Ids;
  }
}
