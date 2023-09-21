import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { Post } from './domain/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

const RABI_URL =
  process.env.RABI_URL || 'amqp://guest:guest@rabbitmq-notification:5672';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Post]),
    ClientsModule.register([
      {
        name: 'POST',
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
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule],
})
export class PostModule {}
