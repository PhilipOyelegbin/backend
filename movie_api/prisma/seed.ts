import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const root = await prisma.user.upsert({
    where: { email: process.env.SEED_USER_EMAIL },
    update: {},
    create: {
      name: process.env.SEED_USER_NAME,
      email: process.env.SEED_USER_EMAIL,
      password: await argon.hash(process.env.SEED_PASSWORD),
      role: 'Admin',
    },
  });

  console.log({ root });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
