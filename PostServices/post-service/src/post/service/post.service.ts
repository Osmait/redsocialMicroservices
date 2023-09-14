import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { PostResponse } from '../domain/postDto';
import { lastValueFrom, map } from 'rxjs';

const COMMENT_URL = 'http://comment-service:8000';
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
    this.postRepository.save(post);
  }

  public async findAll(userId: string, token: string) {
    this.header.headers.Authorization = `Bearer ${token}`;
    const postList = await this.postRepository.find({
      where: { userId, deleted: false },
      order: {
        createdAt: 'DESC',
      },
    });
    return await this.postResponseFetch(postList);
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

  private async postResponseFetch(postList: Post[]): Promise<PostResponse[]> {
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
}
