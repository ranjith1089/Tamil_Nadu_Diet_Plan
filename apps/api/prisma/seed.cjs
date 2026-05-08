const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const foods = [
  { id: 'food_idli', name: 'idli', calories: 58, protein: 2.0, carbs: 12.0, fat: 0.4 },
  { id: 'food_dosa', name: 'dosa', calories: 133, protein: 3.0, carbs: 18.0, fat: 5.0 },
  { id: 'food_sambar', name: 'sambar', calories: 80, protein: 3.0, carbs: 10.0, fat: 3.0 },
  { id: 'food_rice', name: 'rice', calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3 },
  { id: 'food_pongal', name: 'pongal', calories: 190, protein: 5.0, carbs: 28.0, fat: 6.0 },
  { id: 'food_chapati', name: 'chapati', calories: 120, protein: 3.5, carbs: 20.0, fat: 2.5 },
  { id: 'food_chicken', name: 'chicken', calories: 239, protein: 27.0, carbs: 0.0, fat: 14.0 },
  { id: 'food_fish', name: 'fish', calories: 206, protein: 22.0, carbs: 0.0, fat: 12.0 },
];

async function main() {
  for (const food of foods) {
    await prisma.foodItem.upsert({
      where: { id: food.id },
      update: {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      },
      create: food,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
