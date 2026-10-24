import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/password.util';

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  color: string;
  discountPercent: number;
  stock: number;
  categoryId: number;
};

async function ensureProduct(product: SeedProduct) {
  const existing = await prisma.product.findFirst({
    where: { name: product.name },
  });

  if (existing) {
    return prisma.product.update({
      where: { id: existing.id },
      data: product,
    });
  }

  return prisma.product.create({
    data: product,
  });
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Training Admin',
      passwordHash: hashPassword('Admin123!'),
      role: 'ADMIN',
    },
    create: {
      name: 'Training Admin',
      email: 'admin@example.com',
      passwordHash: hashPassword('Admin123!'),
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {
      name: 'Training Student',
      passwordHash: hashPassword('Student123!'),
      role: 'USER',
    },
    create: {
      name: 'Training Student',
      email: 'student@example.com',
      passwordHash: hashPassword('Student123!'),
      role: 'USER',
    },
  });

  const bedroom = await prisma.category.upsert({
    where: { name: 'Bedroom' },
    update: { description: 'Furniture for bedrooms' },
    create: {
      name: 'Bedroom',
      description: 'Furniture for bedrooms',
    },
  });

  const livingRoom = await prisma.category.upsert({
    where: { name: 'Living Room' },
    update: { description: 'Sofas, chairs and living room furniture' },
    create: {
      name: 'Living Room',
      description: 'Sofas, chairs and living room furniture',
    },
  });

  const homeOffice = await prisma.category.upsert({
    where: { name: 'Home Office' },
    update: { description: 'Furniture for work and study spaces' },
    create: {
      name: 'Home Office',
      description: 'Furniture for work and study spaces',
    },
  });

  const diningTable = await prisma.category.upsert({
    where: { name: 'Dining Table' },
    update: { description: 'Dining room furniture' },
    create: {
      name: 'Dining Table',
      description: 'Dining room furniture',
    },
  });

  const more = await prisma.category.upsert({
    where: { name: 'More' },
    update: { description: 'Other furniture' },
    create: {
      name: 'More',
      description: 'Other furniture',
    },
  });

  const products: SeedProduct[] = [
    {
      name: 'Stylish Soft Chair',
      description: 'A comfortable soft chair for modern living rooms.',
      price: 20,
      imageUrl: 'https://placehold.co/600x400?text=Stylish+Soft+Chair',
      color: 'Beige',
      discountPercent: 10,
      stock: 30,
      categoryId: livingRoom.id,
    },
    {
      name: 'Modern Soft Sofa',
      description: 'A modern sofa with a simple and clean design.',
      price: 40,
      imageUrl: 'https://placehold.co/600x400?text=Modern+Soft+Sofa',
      color: 'Gray',
      discountPercent: 20,
      stock: 20,
      categoryId: livingRoom.id,
    },
    {
      name: 'Comfortable Soft Chair',
      description: 'A comfortable chair suitable for reading and relaxing.',
      price: 40,
      imageUrl: 'https://placehold.co/600x400?text=Comfortable+Chair',
      color: 'White',
      discountPercent: 0,
      stock: 25,
      categoryId: bedroom.id,
    },
    {
      name: 'Home Office Chair',
      description: 'A practical chair for a simple home office.',
      price: 32,
      imageUrl: 'https://placehold.co/600x400?text=Office+Chair',
      color: 'Black',
      discountPercent: 5,
      stock: 18,
      categoryId: homeOffice.id,
    },
    {
      name: 'Dining Chair',
      description: 'A minimal dining chair for everyday use.',
      price: 24,
      imageUrl: 'https://placehold.co/600x400?text=Dining+Chair',
      color: 'Brown',
      discountPercent: 15,
      stock: 40,
      categoryId: diningTable.id,
    },
    {
      name: 'Classic Sofa',
      description: 'A classic three-seat sofa.',
      price: 80,
      imageUrl: 'https://placehold.co/600x400?text=Classic+Sofa',
      color: 'Blue',
      discountPercent: 10,
      stock: 12,
      categoryId: more.id,
    },
    {
      name: 'Cloud Living Sofa',
      description: 'A soft living room sofa with deep cushions.',
      price: 95,
      imageUrl: 'https://placehold.co/600x400?text=Cloud+Living+Sofa',
      color: 'White',
      discountPercent: 20,
      stock: 15,
      categoryId: livingRoom.id,
    },
    {
      name: 'Minimal Lounge Chair',
      description: 'Minimal lounge chair for modern interiors.',
      price: 55,
      imageUrl: 'https://placehold.co/600x400?text=Minimal+Lounge+Chair',
      color: 'Beige',
      discountPercent: 0,
      stock: 22,
      categoryId: livingRoom.id,
    },
    {
      name: 'Executive Office Chair',
      description: 'Ergonomic office chair for long work sessions.',
      price: 68,
      imageUrl: 'https://placehold.co/600x400?text=Executive+Office+Chair',
      color: 'Black',
      discountPercent: 12,
      stock: 17,
      categoryId: homeOffice.id,
    },
    {
      name: 'Oak Dining Chair',
      description: 'Wooden dining chair with a warm oak finish.',
      price: 35,
      imageUrl: 'https://placehold.co/600x400?text=Oak+Dining+Chair',
      color: 'Brown',
      discountPercent: 8,
      stock: 35,
      categoryId: diningTable.id,
    },
    {
      name: 'Bedroom Accent Chair',
      description: 'A compact accent chair for bedroom corners.',
      price: 45,
      imageUrl: 'https://placehold.co/600x400?text=Bedroom+Accent+Chair',
      color: 'Pink',
      discountPercent: 18,
      stock: 14,
      categoryId: bedroom.id,
    },
    {
      name: 'Modern Bench',
      description: 'A versatile modern bench for different rooms.',
      price: 52,
      imageUrl: 'https://placehold.co/600x400?text=Modern+Bench',
      color: 'Gray',
      discountPercent: 0,
      stock: 16,
      categoryId: more.id,
    },
  ];

  for (const product of products) {
    await ensureProduct(product);
  }

  console.log('Seed completed safely');
  console.log('Training users:', admin.email, student.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
