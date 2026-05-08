import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FoodsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(search?: string) {
    return this.prisma.foodItem.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.foodItem.findUnique({
      where: { id },
    });
  }
}
