import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowerModule } from './follower/follower.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [FollowerModule, DatabaseModule, PrometheusModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
