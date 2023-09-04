/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { FollowerController } from './follower.controller';
import { FollowerService } from '../service/follower.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Follower } from '../domain/follower';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

describe('FollowerController', () => {
  let controller: FollowerController;
  let service: FollowerService;
  let followRepository: Repository<Follower>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowerController],
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

    controller = module.get<FollowerController>(FollowerController);
    service = module.get<FollowerService>(FollowerService);
    followRepository = module.get<Repository<Follower>>(
      getRepositoryToken(Follower),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
