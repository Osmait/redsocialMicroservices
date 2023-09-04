import { Test, TestingModule } from '@nestjs/testing';
import { FollowerService } from './follower.service';
import { Follower, User } from '../domain/follower';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('FollowerService', () => {
  let service: FollowerService;
  let followRepository: Repository<Follower>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowerService,
        {
          provide: getRepositoryToken(Follower),
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

    service = module.get<FollowerService>(FollowerService);
    followRepository = module.get<Repository<Follower>>(
      getRepositoryToken(Follower),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('follow', () => {
    it('should save a follower', async () => {
      const follower = new Follower(); // Create a Follower object here
      const saveSpy = jest
        .spyOn(followRepository, 'save')
        .mockResolvedValue(follower);

      await service.follow(follower);

      expect(saveSpy).toHaveBeenCalledWith(follower);
    });
  });

  describe('getfollowing', () => {
    it('should return a list of followers for a user', async () => {
      const userId = 'someUserId'; // Provide a valid user ID here
      const followers = [new Follower(), new Follower()]; // Create Follower objects as needed
      const findSpy = jest
        .spyOn(followRepository, 'find')
        .mockResolvedValue(followers);

      const result = await service.getfollowing(userId);

      expect(findSpy).toHaveBeenCalledWith({ where: { followerId: userId } });
      expect(result).toEqual(followers);
    });
  });

  describe('getfollowers', () => {
    it('should return a list of users following a user', async () => {
      const userId = 'someUserId'; // Provide a valid user ID here
      const followers = [new Follower(), new Follower()]; // Create Follower objects as needed
      const users: User[] = [
        {
          id: '1',
          name: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          address: '123 Main St',
          email: 'john.doe@example.com',
          img: null,
          createAt: new Date(),
          updateAt: new Date(),
        },
        {
          id: '2',
          name: 'juan',
          lastName: 'duh',
          phone: '1234567890',
          address: '123 Main St',
          email: 'juan.duh@example.com',
          img: null,
          createAt: new Date(),
          updateAt: new Date(),
        },
      ]; // Create User objects as needed

      jest.spyOn(followRepository, 'find').mockResolvedValue(followers);

      const mockCommentResponse = {
        data: JSON.stringify(users),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockCommentResponse));

      const result = await service.getfollowers(userId);

      expect(result.length).toBe(users.length);
    });

    it('should throw an exception when an error occurs during HTTP request', async () => {
      const userId = 'someUserId'; // Provide a valid user ID here
      const followers = [new Follower()]; // Create a Follower object as needed

      jest.spyOn(followRepository, 'find').mockResolvedValue(followers);

      const getSpy = jest.spyOn(httpService, 'get');
      getSpy.mockReturnValue(throwError(new Error('HTTP error')));

      await expect(service.getfollowers(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
