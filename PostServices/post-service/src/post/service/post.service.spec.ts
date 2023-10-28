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
import { AxiosError, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

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
        toJSON: function(): object {
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
      const postId = '1';
      const mockPost = new Post();
      mockPost.id = postId;

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);

      await postService.delete(postId);

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
