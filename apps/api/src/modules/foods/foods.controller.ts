import { Controller, Get, Param, Query } from '@nestjs/common';
import { FoodQueryDto } from './dto/food-query.dto';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  findAll(@Query() query: FoodQueryDto) {
    return this.foodsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }
}
