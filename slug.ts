import { prisma } from './src/lib/prisma';
(async () => {
  console.log(await prisma.blogPost.findMany({ select: { slug: true } }));
  console.log(await prisma.programme.findMany({ select: { slug: true, name: true } }));
  await prisma.$disconnect();
})();
