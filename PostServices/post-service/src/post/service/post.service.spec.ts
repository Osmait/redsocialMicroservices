import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AxiosError, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { PostResponse } from '../domain/postDto';
import { randomUUID } from 'crypto';

// Función para generar una instancia de Post con datos simulados
function createRandomPost(n: number): Post[] {
  const postList = [];
  for (let i = 0; n > i; i++) {
    const post: Post = {
      id: randomUUID(),
      content: faker.lorem.paragraph(),
      createdAt: faker.date.anytime(),
      userId: randomUUID(),
      deleted: false,
    };

    postList.push(post);
  }
  return postList;
}

// Función para generar una instancia de PostResponse con datos simulados
function createRandomPostResponse(n: number): PostResponse[] {
  const postRList: PostResponse[] = [];
  for (let i = 0; n > i; i++) {
    const post = createRandomPost(n)[0]; // Crea una instancia de Post con datos simulados

    const comment = faker.lorem.sentence(); // Genera un comentario aleatorio con Faker
    const postr = new PostResponse(post, comment);
    postRList.push(postr);
  }
  return postRList;
}

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<Post>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    httpService = module.get<HttpService>(HttpService);
  });

  describe('created', () => {
    it('should save a post with a generated UUID', () => {
      const post = new Post();
      post.content = 'Test Content';

      postService.created(post);

      expect(post.id).toBeDefined();
      expect(postRepository.save).toHaveBeenCalledWith(post);
    });
  });

  describe('GetFeed', () => {
    it('should return a list of posts with comments', async () => {
      const userId = '1';

      const mockPostResponseList = createRandomPostResponse(5);

      const mockPost = createRandomPost(5);

      const mockPostResponseWithCommentList = {
        post: mockPostResponseList,
        total: mockPostResponseList.length,
      };
      jest
        .spyOn(postService, 'getFollower')
        .mockResolvedValue(['follower1', 'follower2']);

      jest
        .spyOn(postRepository, 'findAndCount')
        .mockResolvedValue([mockPost, 10]);
      jest
        .spyOn(postService, 'postResponseFetchComment')
        .mockResolvedValue(mockPostResponseList);

      const result = await postService.getFeed(userId, '1', 1, 10);

      expect(result.post.length).toBe(
        mockPostResponseWithCommentList.post.length,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of posts with comments', async () => {
      const userId = '1';
      const mockPostList = [new Post(), new Post()];

      jest.spyOn(postRepository, 'find').mockResolvedValue(mockPostList);

      // Anota explícitamente el tipo de mockCommentResponse
      const mockCommentResponse: AxiosResponse<string, any> = {
        data: 'Test Comment',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockCommentResponse));
      const result = await postService.findAll(userId, '1');

      expect(result.length).toBe(mockPostList.length);
      expect(httpService.get).toHaveBeenCalled();
    });

    it('should handle errors and throw an exception', async () => {
      const userId = '1';
      jest.spyOn(postRepository, 'find').mockResolvedValue([new Post()]);

      // Convierte el error en un observable usando 'throwError' de RxJS
      const mockError: AxiosError = {
        name: 'AxiosError',
        message: 'Test Error',
        config: {
          headers: undefined,
        },
        code: 'SOME_ERROR_CODE',
        request: {},
        response: {
          data: undefined,
          status: 0,
          statusText: '',
          headers: undefined,
          config: undefined,
        },
        isAxiosError: false,
        toJSON: function (): object {
          throw new Error('Function not implemented.');
        },
      };
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => mockError));

      await expect(postService.findAll(userId, '1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should mark a post as deleted', async () => {
      const mockPost = createRandomPost(1)[0];

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);

      await postService.delete(mockPost.id);

      expect(mockPost.deleted).toBe(true);
      expect(postRepository.save).toHaveBeenCalledWith(mockPost);
    });

    it('should throw NotFoundException if the post does not exist', async () => {
      const postId = '1';

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(undefined);

      await expect(postService.delete(postId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
