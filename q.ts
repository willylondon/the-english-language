import { prisma } from './src/lib/prisma';
(async () => {
  const progs = await prisma.programme.findMany({ orderBy: { order: 'asc' }, select: { name: true, slug: true } });
  const classes = await prisma.class.findMany({ select: { title: true }, orderBy: { createdAt: 'asc' } });
  console.log("PROGRAMMES:", JSON.stringify(progs.map(p => p.name)));
  console.log("CLASSES:", JSON.stringify(classes.map(c => c.title)));
  await prisma.$disconnect();
})();
