import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  created(post: Post) {
    post.id = randomUUID();
    this.postRepository.save(post);
  }

  async findAll(userId: string) {
    return await this.postRepository.find({
      where: { userId, deleted: false },
    });
  }

  async delete(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    post.deleted = true;
    this.postRepository.save(post);
  }
}
