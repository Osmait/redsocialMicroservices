import { Module } from '@nestjs/common';
import { FollowerController } from './controller/follower.controller';
import { FollowerService } from './service/follower.service';
import { Follower } from './domain/follower';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
const RABI_URL =
  process.env.RABI_URL || 'amqp://guest:guest@rabbitmq-notification:5672';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Follower]),
    ClientsModule.register([
      {
        name: 'FOLLOW',
        transport: Transport.RMQ,
        options: {
          urls: [RABI_URL],
          queue: 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [FollowerController],
  providers: [FollowerService],
  exports: [TypeOrmModule],
})
export class FollowerModule {}
