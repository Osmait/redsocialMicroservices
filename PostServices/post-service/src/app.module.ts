import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import {
  PrometheusModule,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';
import { LoggerMiddleware } from './latency.middleware';

@Module({
  imports: [
    DatabaseModule,
    PostModule,
    PrometheusModule.register(),
    ClientsModule.register([
      {
        name: 'HELLO',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'userId_1_notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    makeSummaryProvider({
      name: 'register_latency',
      help: 'metric_help',
      percentiles: [0.01, 0.1, 0.9, 0.99],
      labelNames: ['method', 'path'],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
