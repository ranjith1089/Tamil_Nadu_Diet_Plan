import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodQueryDto } from './dto/food-query.dto';
import { FoodsRepository } from './foods.repository';

@Injectable()
export class FoodsService {
  constructor(private readonly foodsRepository: FoodsRepository) {}

  findAll(query: FoodQueryDto) {
    return this.foodsRepository.findMany(query.search?.trim());
  }

  async findOne(id: string) {
    const food = await this.foodsRepository.findById(id);

    if (!food) {
      throw new NotFoundException(`Food item not found: ${id}`);
    }

    return food;
  }
}
