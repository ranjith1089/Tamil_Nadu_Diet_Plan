import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FoodsController } from './foods.controller';
import { FoodsRepository } from './foods.repository';
import { FoodsService } from './foods.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FoodsController],
  providers: [FoodsService, FoodsRepository],
})
export class FoodsModule {}
