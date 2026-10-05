import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const bedroom = await prisma.category.create({
    data: { name: 'Bedroom', description: 'Furniture for bedrooms' },
  });

  const livingRoom = await prisma.category.create({
    data: {
      name: 'Living Room',
      description: 'Sofas, chairs and living room furniture',
    },
  });

  const homeOffice = await prisma.category.create({
    data: {
      name: 'Home Office',
      description: 'Furniture for work and study spaces',
    },
  });

  const diningTable = await prisma.category.create({
    data: { name: 'Dining Table', description: 'Dining room furniture' },
  });

  const more = await prisma.category.create({
    data: { name: 'More', description: 'Other furniture' },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Stylish Soft Chair',
        description: 'A comfortable soft chair for modern living rooms.',
        price: 20,
        imageUrl: 'https://placehold.co/600x400?text=Stylish+Soft+Chair',
        categoryId: livingRoom.id,
      },
      {
        name: 'Modern Soft Sofa',
        description: 'A modern sofa with a simple and clean design.',
        price: 40,
        imageUrl: 'https://placehold.co/600x400?text=Modern+Soft+Sofa',
        categoryId: livingRoom.id,
      },
      {
        name: 'Comfortable Soft Chair',
        description: 'A comfortable chair suitable for reading and relaxing.',
        price: 40,
        imageUrl: 'https://placehold.co/600x400?text=Comfortable+Chair',
        categoryId: bedroom.id,
      },
      {
        name: 'Home Office Chair',
        description: 'A practical chair for a simple home office.',
        price: 32,
        imageUrl: 'https://placehold.co/600x400?text=Office+Chair',
        categoryId: homeOffice.id,
      },
      {
        name: 'Dining Chair',
        description: 'A minimal dining chair for everyday use.',
        price: 24,
        imageUrl: 'https://placehold.co/600x400?text=Dining+Chair',
        categoryId: diningTable.id,
      },
      {
        name: 'Classic Sofa',
        description: 'A classic three-seat sofa.',
        price: 80,
        imageUrl: 'https://placehold.co/600x400?text=Classic+Sofa',
        categoryId: more.id,
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
