import { prisma } from './src/lib/prisma';
(async () => {
  const t = await prisma.testimonial.findMany({ select: { id: true, parentName: true, programme: true } });
  console.log("TESTIMONIALS:", JSON.stringify(t));
  const b = await prisma.blogPost.findMany({ select: { id: true, title: true, excerpt: true } });
  console.log("BLOG:", JSON.stringify(b));
  await prisma.$disconnect();
})();
