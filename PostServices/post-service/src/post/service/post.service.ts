import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { PostResponse } from '../domain/postDto';
import { lastValueFrom, map } from 'rxjs';
@Injectable()
export class PostService {
  header = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly httpService: HttpService,
  ) {}

  created(post: Post) {
    post.id = randomUUID();
    this.postRepository.save(post);
  }

  async findAll(userId: string) {
    const postList = await this.postRepository.find({
      where: { userId, deleted: false },
    });
    const postReponse: PostResponse[] = [];
    for (const post of postList) {
      try {
        const comment = await lastValueFrom(
          this.httpService
            .get(`http://127.0.0.1:8000/comment/${post.id}`, this.header)
            .pipe(map((res) => res.data)),
        );

        const postR = new PostResponse(post, comment);
        postReponse.push(postR);
      } catch (error) {
        console.log(error);
      }
    }
    return postReponse;
  }

  async delete(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    post.deleted = true;
    this.postRepository.save(post);
  }
}
