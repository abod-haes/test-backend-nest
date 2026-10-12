import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bedroom = await prisma.category.upsert({
    where: {
      name: 'Bedroom',
    },
    update: {
      description: 'Furniture for bedrooms',
    },
    create: {
      name: 'Bedroom',
      description: 'Furniture for bedrooms',
    },
  });

  const livingRoom = await prisma.category.upsert({
    where: {
      name: 'Living Room',
    },
    update: {
      description:
        'Sofas, chairs and living room furniture',
    },
    create: {
      name: 'Living Room',
      description:
        'Sofas, chairs and living room furniture',
    },
  });

  const homeOffice = await prisma.category.upsert({
    where: {
      name: 'Home Office',
    },
    update: {
      description:
        'Furniture for work and study spaces',
    },
    create: {
      name: 'Home Office',
      description:
        'Furniture for work and study spaces',
    },
  });

  const diningTable = await prisma.category.upsert({
    where: {
      name: 'Dining Table',
    },
    update: {
      description: 'Dining room furniture',
    },
    create: {
      name: 'Dining Table',
      description: 'Dining room furniture',
    },
  });

  const more = await prisma.category.upsert({
    where: {
      name: 'More',
    },
    update: {
      description: 'Other furniture',
    },
    create: {
      name: 'More',
      description: 'Other furniture',
    },
  });

  const productsCount =
    await prisma.product.count();

  if (productsCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Stylish Soft Chair',
          description:
            'A comfortable soft chair for modern living rooms.',
          price: 20,
          imageUrl:
            'https://placehold.co/600x400?text=Stylish+Soft+Chair',
          categoryId: livingRoom.id,
        },
        {
          name: 'Modern Soft Sofa',
          description:
            'A modern sofa with a simple and clean design.',
          price: 40,
          imageUrl:
            'https://placehold.co/600x400?text=Modern+Soft+Sofa',
          categoryId: livingRoom.id,
        },
        {
          name: 'Comfortable Soft Chair',
          description:
            'A comfortable chair suitable for reading and relaxing.',
          price: 40,
          imageUrl:
            'https://placehold.co/600x400?text=Comfortable+Chair',
          categoryId: bedroom.id,
        },
        {
          name: 'Home Office Chair',
          description:
            'A practical chair for a simple home office.',
          price: 32,
          imageUrl:
            'https://placehold.co/600x400?text=Office+Chair',
          categoryId: homeOffice.id,
        },
        {
          name: 'Dining Chair',
          description:
            'A minimal dining chair for everyday use.',
          price: 24,
          imageUrl:
            'https://placehold.co/600x400?text=Dining+Chair',
          categoryId: diningTable.id,
        },
        {
          name: 'Classic Sofa',
          description:
            'A classic three-seat sofa.',
          price: 80,
          imageUrl:
            'https://placehold.co/600x400?text=Classic+Sofa',
          categoryId: more.id,
        },
      ],
    });
  }

  console.log('Seed completed safely');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
