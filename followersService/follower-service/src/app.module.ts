import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowerModule } from './follower/follower.module';
import {
  PrometheusModule,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './latency.middleware';

@Module({
  imports: [FollowerModule, DatabaseModule, PrometheusModule.register()],
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
