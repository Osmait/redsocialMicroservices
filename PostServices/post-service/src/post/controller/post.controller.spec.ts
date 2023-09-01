import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';

import { Post } from '../domain/post.entity';

import { PostService } from '../service/post.service';
import { ClientProxy } from '@nestjs/microservices';
import { PostResponse } from '../domain/postDto';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            findAll: jest.fn(),
            created: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'POST',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
    clientProxy = module.get<ClientProxy>('POST');
  });

  describe('getPost', () => {
    it('should call postService.findAll and return the result', async () => {
      const userId = '1';
      const comment = 'Test Comment';
      const post1 = new Post();
      post1.content = 'prueba';
      post1.id = '12';
      post1.userId = '1';
      const expectedResult: PostResponse[] = [{ post: post1, comment }];

      jest.spyOn(postService, 'findAll').mockResolvedValue(expectedResult);

      const result = await postController.getPost(userId, comment);

      expect(postService.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deletePost', () => {
    it('should call postService.delete', () => {
      const postId = '1';

      postController.deletePost(postId);

      expect(postService.delete).toHaveBeenCalledWith(postId);
    });
  });
});
