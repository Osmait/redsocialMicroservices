import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowerModule } from './follower/follower.module';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [FollowerModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
