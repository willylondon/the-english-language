import { prisma } from './src/lib/prisma';
(async () => {
  const b = await prisma.blogPost.update({
    where: { slug: '5-comprehension-strategies-every-student-should-know' },
    data: { tags: { set: 'comprehension,reading,study skills,CSEC,IGCSE' } },
  });
  console.log('tags:', b.tags);
  await prisma.$disconnect();
})();
