import { prisma } from './src/lib/prisma';
(async () => {
  // 1. testimonial: PEP Language Arts -> Grades 4-6 Language Arts; PEP mock exams -> practice exams
  const t = await prisma.testimonial.updateMany({
    where: { programme: 'PEP Language Arts' },
    data: {
      programme: 'Grades 4–6 Language Arts',
      content: { set: 'My daughter went from struggling with comprehension to scoring in the top band on her practice exams. The small group size made all the difference — she finally felt comfortable asking questions. We could not be happier with her progress.' },
    },
  });
  console.log('testimonials updated:', t.count);

  // 2. blog post: remove PEP wording
  const b = await prisma.blogPost.update({
    where: { slug: '5-comprehension-strategies-every-student-should-know' },
    data: {
      excerpt: { set: 'Whether your child is preparing for CSEC, IGCSE, or IB, these five comprehension strategies will help them read more effectively, understand more deeply, and answer more precisely.' },
      content: { set: "Reading comprehension is not just about understanding the words on the page. It is about engaging with the text actively, making connections, and constructing meaning. These five strategies work across all levels — from Grade 4 comprehension fundamentals to IGCSE and IB literature.\n\n1. Preview before you read. Look at headings, images, and the first sentence of each paragraph to build a mental map of the passage.\n\n2. Read with purpose. Know what the questions ask before diving into detailed reading.\n\n3. Annotate actively. Underline key ideas, circle transitions like however and therefore, and note unfamiliar words.\n\n4. Read between the lines. Inference questions reward students who connect stated ideas to unstated conclusions.\n\n5. Practise precise answering. Quote the text, answer the exact question asked, and keep responses tight.\n\nMaster these habits early and every paper — comprehension, summary, even essay writing — becomes more manageable." },
      metaDescription: { set: 'Five proven reading comprehension strategies for CSEC, IGCSE and IB students. Help your child read actively, infer confidently and answer precisely.' },
    },
  });
  console.log('blog updated:', b.id);

  // 3. Essay Writing description: drop PEP
  const p = await prisma.programme.update({
    where: { slug: 'essay-writing' },
    data: { description: { set: 'Build strong paragraph and essay structure skills step by step. Students learn to plan, draft and revise compositions — from primary-level sentences to high-school argumentative essays.' } },
  });
  console.log('programme updated:', p.id);
  await prisma.$disconnect();
})();
