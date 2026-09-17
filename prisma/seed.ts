import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── Admin User ──────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@theenglishlanguage.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Programmes ──────────────────────────────────────────
  const programmesData = [
    {
      name: 'CSEC English B (Literature)',
      slug: 'csec-english-b',
      tagline: 'Excel in Drama, Poetry, Prose, and Literary Analysis',
      description: 'Our CSEC English B programme provides comprehensive, text-specific preparation across Drama (Shakespeare and Modern Drama), Poetry (the 20 CXC prescribed poems), and Prose (West Indian and World literature). Students develop nuanced close-reading skills and master comparative essay structuring for top CXC grades.',
      ageRange: 'Grades 10–11 (Ages 14–17)',
      examBoard: 'Caribbean Examinations Council (CXC)',
      icon: 'BookOpen',
      color: 'emerald',
      order: 1,
    },
    {
      name: 'CSEC English A',
      slug: 'csec-english-a',
      tagline: 'Master Paper 01, Paper 02, and SBA with confidence',
      description: 'A Grade I or II in CSEC English A is the gateway to sixth form, university, and professional opportunity across the Caribbean. Our programme systematically prepares students for every component of the exam — from the 60-item multiple-choice Paper 01 to the demanding four-section Paper 02.',
      ageRange: 'Grades 10–11 (Ages 15–17)',
      examBoard: 'Caribbean Examinations Council (CXC)',
      icon: 'BookOpen',
      color: 'blue',
      order: 2,
    },
    {
      name: 'IGCSE English Language',
      slug: 'igcse-english-language',
      tagline: 'Excel in Cambridge First Language English',
      description: 'Our IGCSE English Language programme prepares students for Cambridge First Language English (0500), developing the analytical reading and polished writing skills that distinguish top candidates.',
      ageRange: 'Grades 10–11 (Ages 14–16)',
      examBoard: 'Cambridge Assessment International Education',
      icon: 'Globe',
      color: 'purple',
      order: 3,
    },
    {
      name: 'IB English',
      slug: 'ib-english',
      tagline: 'Navigate Language A with analytical rigour',
      description: 'The IB Diploma demands sophisticated literary analysis and independent critical thinking. Our IB English programme supports students in both Language A: Literature and Language A: Language and Literature at Standard and Higher Level.',
      ageRange: 'Grades 12–13 (Ages 16–19)',
      examBoard: 'International Baccalaureate',
      icon: 'Award',
      color: 'red',
      order: 4,
    },
    {
      name: 'Essay Writing',
      slug: 'essay-writing',
      tagline: 'Master every essay type with structure and style',
      description: 'Strong essay writing is the single most transferable skill across all English examinations. Our essay writing programme takes students from basic paragraph construction to sophisticated multi-paragraph compositions.',
      ageRange: 'Grades 4–13 (Ages 9–19)',
      examBoard: 'All Levels',
      icon: 'PenTool',
      color: 'amber',
      order: 5,
    },
    {
      name: 'Comprehension Skills',
      slug: 'comprehension-skills',
      tagline: 'Read critically, think deeply, answer precisely',
      description: 'Comprehension is the foundation of every English exam. Our programme develops students\' ability to read critically, identify main ideas, make inferences, analyse author purpose, and construct precise written responses.',
      ageRange: 'Grades 4–13 (Ages 9–19)',
      examBoard: 'All Levels',
      icon: 'Search',
      color: 'teal',
      order: 6,
    },
  ];

  const programmes: Record<string, string> = {};
  for (const prog of programmesData) {
    const created = await prisma.programme.upsert({
      where: { slug: prog.slug },
      update: prog,
      create: prog,
    });
    programmes[prog.slug] = created.id;
    console.log(`✅ Programme: ${prog.name}`);
  }

  // ── Classes ─────────────────────────────────────────────
  const classesData = [
    // CSEC English B (Literature) Classes
    {
      programmeSlug: 'csec-english-b',
      title: 'CSEC English B: Drama & Shakespeare Masterclass',
      description: 'Close textual analysis of prescribed Shakespearean and modern West Indian drama. Learn scene dissection, dramatic conventions, and character motivation.',
      dayOfWeek: 'Tuesday',
      startTime: '17:00',
      endTime: '18:30',
      capacity: 8,
      enrolledCount: 4,
      priceJMD: 4200,
      term: 'Michaelmas 2026',
    },
    {
      programmeSlug: 'csec-english-b',
      title: 'CSEC English B: Poetry Workshop (The 20 Poems)',
      description: 'Systematic analysis of themes, poetic techniques, tone, and comparison across the 20 CXC prescribed poems for Paper 02.',
      dayOfWeek: 'Thursday',
      startTime: '17:00',
      endTime: '18:30',
      capacity: 8,
      enrolledCount: 5,
      priceJMD: 4200,
      term: 'Michaelmas 2026',
    },
    {
      programmeSlug: 'csec-english-b',
      title: 'CSEC English B: Comparative Prose & Essay Clinic',
      description: 'Techniques for comparative literary essays, sustained thematic arguments, and timed essay execution for maximum marks.',
      dayOfWeek: 'Saturday',
      startTime: '13:00',
      endTime: '14:30',
      capacity: 8,
      enrolledCount: 3,
      priceJMD: 4500,
      term: 'Michaelmas 2026',
    },
    // CSEC Classes
    {
      programmeSlug: 'csec-english-a',
      title: 'CSEC English A Paper 02 Masterclass',
      description: 'Deep-dive preparation for the written paper covering summary, comprehension, narrative/descriptive, and argumentative writing.',
      dayOfWeek: 'Thursday',
      startTime: '17:00',
      endTime: '18:30',
      capacity: 10,
      enrolledCount: 7,
      priceJMD: 4000,
      term: 'Michaelmas 2026',
    },
    {
      programmeSlug: 'csec-english-a',
      title: 'CSEC English SBA Clinic',
      description: 'Guided SBA portfolio development including topic selection, artifact creation, reflective writing, and oral presentation coaching.',
      dayOfWeek: 'Saturday',
      startTime: '11:00',
      endTime: '12:30',
      capacity: 6,
      enrolledCount: 4,
      priceJMD: 4500,
      term: 'Michaelmas 2026',
    },
    // IGCSE Classes
    {
      programmeSlug: 'igcse-english-language',
      title: 'IGCSE Language Paper 1 & 2 Prep',
      description: 'Comprehensive preparation for Cambridge First Language English covering reading analysis, directed writing, and composition.',
      dayOfWeek: 'Monday',
      startTime: '17:00',
      endTime: '18:30',
      capacity: 6,
      enrolledCount: 2,
      priceJMD: 5000,
      term: 'Michaelmas 2026',
    },
    // IB Classes
    {
      programmeSlug: 'ib-english',
      title: 'IB English IO & Paper Prep',
      description: 'Preparation for the Individual Oral, Paper 1 guided analysis, and Paper 2 comparative essay. SL and HL students welcome.',
      dayOfWeek: 'Wednesday',
      startTime: '18:00',
      endTime: '19:30',
      capacity: 4,
      enrolledCount: 1,
      priceJMD: 6000,
      term: 'Michaelmas 2026',
    },
    // Essay Writing Classes
    {
      programmeSlug: 'essay-writing',
      title: 'Essay Writing Bootcamp (Grades 4–6)',
      description: 'Build strong paragraph and essay structure skills. Students learn to plan, draft and revise compositions — from primary-level sentences to high-school argumentative essays.',
      dayOfWeek: 'Friday',
      startTime: '16:00',
      endTime: '17:15',
      capacity: 8,
      enrolledCount: 4,
      priceJMD: 3000,
      term: 'Michaelmas 2026',
    },
    {
      programmeSlug: 'essay-writing',
      title: 'Advanced Essay Writing (Grades 9–11)',
      description: 'Master narrative, descriptive, persuasive, and argumentative essay forms for CSEC and IGCSE examinations.',
      dayOfWeek: 'Monday',
      startTime: '16:00',
      endTime: '17:15',
      capacity: 8,
      enrolledCount: 3,
      priceJMD: 3500,
      term: 'Michaelmas 2026',
    },
    // Comprehension Classes
    {
      programmeSlug: 'comprehension-skills',
      title: 'Reading Comprehension Lab (Grades 4–6)',
      description: 'Develop literal, inferential, and evaluative comprehension skills with graduated-difficulty passages and exam-style questions.',
      dayOfWeek: 'Thursday',
      startTime: '16:00',
      endTime: '17:15',
      capacity: 8,
      enrolledCount: 5,
      priceJMD: 3000,
      term: 'Michaelmas 2026',
    },
    {
      programmeSlug: 'comprehension-skills',
      title: 'Critical Reading Workshop (Grades 9–11)',
      description: 'Advanced comprehension and analysis techniques for CSEC English A and IGCSE texts.',
      dayOfWeek: 'Tuesday',
      startTime: '17:30',
      endTime: '18:45',
      capacity: 8,
      enrolledCount: 2,
      priceJMD: 3500,
      term: 'Michaelmas 2026',
    },
    {
      programmeSlug: 'csec-english-b',
      title: 'CSEC Literature SBA & Oral Presentation Clinic',
      description: 'Individualized guidance on your English B SBA portfolio pieces, critical response reflections, and oral presentation delivery.',
      dayOfWeek: 'Saturday',
      startTime: '15:00',
      endTime: '16:30',
      capacity: 8,
      enrolledCount: 2,
      priceJMD: 4200,
      term: 'Michaelmas 2026',
    },
  ];

  for (const cls of classesData) {
    const { programmeSlug, ...classData } = cls;
    const programmeId = programmes[programmeSlug];
    await prisma.class.create({
      data: {
        ...classData,
        programmeId,
      },
    });
    console.log(`✅ Class: ${cls.title}`);
  }

  // ── Testimonials ────────────────────────────────────────
  const testimonials = [
    {
      parentName: 'Mrs. Anderson',
      studentGrade: 'Grade 6',
      programme: 'Grades 4–6 Language Arts',
      rating: 5,
      content: 'My daughter went from struggling with comprehension to scoring in the top band on her practice exams. The small group size made all the difference — she finally felt comfortable asking questions. We couldn\'t be happier with her progress.',
      isPublished: true,
    },
    {
      parentName: 'Mr. Campbell',
      studentGrade: 'Grade 11',
      programme: 'CSEC English A',
      rating: 5,
      content: 'My son was panicking about his SBA portfolio until he started these sessions. The teacher broke down each component clearly and gave him confidence in his oral presentation. He got a Grade I in English A!',
      isPublished: true,
    },
    {
      parentName: 'Mrs. Williams-Brown',
      studentGrade: 'Grade 10',
      programme: 'IGCSE English Language',
      rating: 5,
      content: 'The writer\'s effect questions were a mystery to my daughter until she joined this class. The teacher\'s approach to breaking down language analysis is excellent. She\'s now consistently scoring A* in her mocks.',
      isPublished: true,
    },
    {
      parentName: 'Dr. McKenzie',
      studentGrade: 'Lower 6th',
      programme: 'IB English',
      rating: 5,
      content: 'Finding a tutor who understands the IB English curriculum in Jamaica is nearly impossible. These lessons have been invaluable for my son\'s Individual Oral preparation and Paper 1 analysis skills.',
      isPublished: true,
    },
    {
      parentName: 'Mrs. Thompson',
      studentGrade: 'Grade 11',
      programme: 'CSEC English B (Literature)',
      rating: 5,
      content: 'Farika brought Shakespeare and the prescribed CXC poems to life for my daughter. Her grades moved from a Grade III to a confident Grade I with distinctions in both Drama and Poetry analysis!',
      isPublished: true,
    },
    {
      parentName: 'Mrs. Henry',
      studentGrade: 'Grade 11',
      programme: 'CSEC English A',
      rating: 4,
      content: 'The Paper 02 practice sessions were exactly what my daughter needed. The teacher provides detailed feedback on every essay and helps students understand exactly what the examiners are looking for.',
      isPublished: true,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
    console.log(`✅ Testimonial: ${testimonial.parentName}`);
  }

  // ── Blog Posts ──────────────────────────────────────────
  const blogPosts = [
    {
      title: 'How to Tackle CSEC English B Paper 02: Drama, Poetry & Prose Guide',
      slug: 'csec-english-b-paper-02-guide',
      excerpt: 'CSEC English B rewards deep analytical thinking, nuanced comparison, and precise textual support. Here are proven strategies to master Drama, Poetry, and Prose for a Grade I.',
      content: `CSEC English B (Literature in English) is one of the most rewarding — and intellectually demanding — subjects in the CXC curriculum. Success requires moving beyond mere plot summaries into close textual analysis, stylistic evaluation, and structured comparative essays.

Understanding the Three Sections of Paper 02

Section A: Drama (Shakespeare and Modern Drama)
Whether analyzing Macbeth, Twelfth Night, or 20th-century Caribbean playwrights like Ti-Jean and His Brothers:
- Focus on dramatic techniques: soliloquies, asides, dramatic irony, lighting, staging, and foils.
- Discuss how conflict drives character transformation.
- Ground your claims with accurate paraphrasing and memorable quotations.

Section B: Poetry (The 20 Prescribed CXC Poems)
The poetry section tests both single-poem analysis and comparative capability:
- Group your poems thematically (e.g., identity and oppression, nature, love and loss, childhood memories).
- Identify the speaker, tone shifts, figurative language (metaphors, personification, sensory imagery), and sound devices.
- In comparative questions, weave both poems together paragraph by paragraph using connective transitions rather than writing two separate essays.

Section C: Prose Fiction (Novels and Short Stories)
Prose questions evaluate your appreciation of narrative craft:
- Analyze point of view, pacing, recurring motifs, and thematic resolution.
- Contrast characters' internal values with societal pressures.
- Always link your observations back to the author's broader societal message.

The Structure of a Top-Band Literature Essay
1. Introduction: Clear thesis statement, mention of author and text titles, and a roadmap of your main analytical points.
2. Body Paragraphs (PEEAL): Point, Evidence (quotations), Explanation (technique analysis), Audience Effect, and Link back to the question.
3. Conclusion: Synthesize your arguments and reflect on the enduring human truth conveyed by the writer.`,
      metaDescription: 'Complete guide to scoring a Grade I in CSEC English B (Literature). Expert tips on Drama, Poetry comparison, and Prose essay structure from Farika Atkins.',
      tags: 'CSEC Literature,English B,CXC,Poetry Analysis,Drama,Jamaica',
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'CSEC English A: A Complete Guide to Paper 02',
      slug: 'csec-english-a-paper-02-guide',
      excerpt: 'Paper 02 is worth 50% of your CSEC English A grade. This guide breaks down all four sections — summary, comprehension, narrative/descriptive, and argumentative — with tips from experienced CXC markers.',
      content: `CSEC English A Paper 02 is the written paper that determines half your final grade. It runs for 2 hours and 40 minutes and contains four sections, each testing different skills. Understanding what the examiners want is the first step to scoring well.

Section A: Summary Writing (Compulsory)

You'll receive a passage of approximately 500 words and must summarise it in 120–150 words. This sounds simple, but it's where many students lose marks unnecessarily.

Key tips:
- Read the passage twice. First for overall meaning, then to identify the key points.
- Identify the main idea of each paragraph — this gives you your summary framework.
- Write in your own words. Direct lifting from the passage is heavily penalised.
- Stick to the word limit. Going over 150 words means you haven't been selective enough.
- Use linking words to ensure your summary flows as a coherent paragraph.

Section B: Reading Comprehension

You'll answer questions on a prose passage that test literal, inferential, and evaluative understanding. Questions range from simple recall to sophisticated analysis.

Key tips:
- Answer in complete sentences unless the question specifically says otherwise.
- For inference questions, always support your answer with evidence from the text.
- Pay attention to mark allocation — a 4-mark question requires more detail than a 1-mark question.
- Watch for questions about writer's purpose and language techniques.

Section C: Narrative or Descriptive Writing

You choose between a narrative (story) prompt and a descriptive prompt. Choose based on your strengths, not what seems "easier."

For narrative writing:
- Plan your story arc: exposition, rising action, climax, resolution.
- Use dialogue to bring characters to life.
- Show, don't tell — "Her hands trembled" is better than "She was nervous."
- Keep your story focused. Don't try to tell an epic — a single well-crafted scene is more effective.

For descriptive writing:
- Appeal to all five senses, not just sight.
- Use figurative language: metaphors, similes, personification.
- Create a clear sense of atmosphere and mood.
- Organise your description spatially (near to far, top to bottom, etc.).

Section D: Persuasive/Argumentative Writing (Compulsory)

This section requires you to write a persuasive piece — typically an essay, a speech, or a letter to the editor. The topic will be current and relevant to Caribbean society.

Key tips:
- Take a clear position and state it in your introduction.
- Use the PEE structure for each paragraph: Point, Evidence, Explanation.
- Address the counterargument — this shows sophistication and earns top-band marks.
- Use rhetorical devices: rhetorical questions, repetition, emotive language.
- End with a strong, memorable conclusion that reinforces your position.

Time Management

With 2 hours and 40 minutes for four sections, time management is critical:
- Section A (Summary): 30 minutes
- Section B (Comprehension): 40 minutes
- Section C (Narrative/Descriptive): 45 minutes
- Section D (Persuasive/Argumentative): 45 minutes

This leaves you with no buffer, so practice writing under timed conditions regularly. Our CSEC English A Paper 02 Masterclass provides weekly timed practice with detailed examiner-level feedback on every piece of writing.`,
      metaDescription: 'Complete guide to CSEC English A Paper 02 with section-by-section breakdown, writing tips, and time management strategies. Expert advice from CXC markers.',
      tags: 'CSEC,CXC,English A,Paper 02,Caribbean,exam prep',
      isPublished: true,
      publishedAt: new Date('2026-09-10'),
    },
    {
      title: '5 Comprehension Strategies Every Student Should Know',
      slug: '5-comprehension-strategies-every-student-should-know',
      excerpt: 'Whether your child is preparing for CSEC, IGCSE, or IB, these five comprehension strategies will help them read more effectively, understand more deeply, and answer more precisely.',
      content: `Reading comprehension isn't just about understanding the words on the page. It's about engaging with the text actively, making connections, and constructing meaning. These five strategies work across all levels — from Grade 4 comprehension fundamentals to IGCSE and IB literature.

Strategy 1: Pre-Reading — Survey Before You Dive In

Before reading a passage in detail, take 30 seconds to survey it:
- Read the title and any subheadings
- Look at the first and last sentences of each paragraph
- Note any bold or italicised words
- Check the source information if provided

This gives your brain a framework to organise the information as you read. It's like looking at a map before starting a journey — you know where you're headed.

Strategy 2: Active Annotation

Don't read passively. Engage with the text:
- Underline or highlight key phrases (not whole sentences)
- Write brief margin notes: "main idea," "example," "contrast"
- Circle unfamiliar words and try to figure out their meaning from context
- Put question marks next to anything confusing

In an exam, you can annotate the question paper. This habit alone can improve comprehension scores by 15–20% because it forces active engagement.

Strategy 3: The PEE Method for Answers

When answering comprehension questions, use PEE:
- Point: State your answer clearly
- Evidence: Quote or reference the specific part of the text that supports your answer
- Explanation: Explain how the evidence supports your point

Example question: "How does the writer create a sense of danger?"
Weak answer: "The writer uses scary words."
Strong answer: "The writer creates a sense of danger through threatening imagery. The phrase 'the shadows crept closer like hungry wolves' uses a simile comparing shadows to predators, suggesting the character is being hunted and is powerless to escape."

Strategy 4: Inference — Reading Between the Lines

Many exam questions require inference — understanding what is implied but not directly stated. To infer:
- Ask yourself: "What does this detail suggest?"
- Look for emotional language, word connotations, and what characters do (not just what they say)
- Consider what the writer chose NOT to include

Practice this daily: when reading any text, stop and ask "What is the writer really trying to say here?" This builds the inferential muscle that earns top marks.

Strategy 5: Vocabulary in Context

You will encounter unfamiliar words in exam passages. Instead of panicking:
- Look at the words around the unfamiliar word
- Consider the overall tone and topic of the sentence
- Think about word parts (prefixes, suffixes, root words)
- Substitute a word you think might fit and check if the sentence still makes sense

Building vocabulary through wide reading is the long-term solution, but these context-clue strategies give you a powerful tool for exam day.

Putting It All Together

These strategies work best when practised regularly. Start with one strategy per week and gradually combine them. Within a month, they'll become second nature.

Our Comprehension Skills programme teaches and practises these strategies systematically, with texts carefully selected to match each student's current level and target exam.`,
      metaDescription: 'Five proven reading comprehension strategies for CSEC, IGCSE, and IB students. Learn active reading, annotation, PEE method, inference, and vocabulary-in-context techniques.',
      tags: 'comprehension,reading,study skills,CSEC,IGCSE',
      isPublished: true,
      publishedAt: new Date('2026-09-15'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`✅ Blog: ${post.title}`);
  }

  // ── Sample Bookings ────────────────────────────────────
  // Get first class for sample bookings
  const sampleClass = await prisma.class.findFirst({
    where: { title: 'Grade 6 Primary Exit Profile Prep' },
  });

  if (sampleClass) {
    await prisma.booking.create({
      data: {
        classId: sampleClass.id,
        studentName: 'Keisha Brown',
        studentGrade: 'Grade 6',
        studentSchool: 'Ardenne Preparatory',
        parentName: 'Mrs. Brown',
        parentEmail: 'parent@example.com',
        parentPhone: '876-555-0123',
        status: 'CONFIRMED',
        referenceNumber: 'TEL-DEMO-001A',
        confirmedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    console.log('✅ Sample booking: Keisha Brown (Confirmed)');

    await prisma.booking.create({
      data: {
        classId: sampleClass.id,
        studentName: 'Marcus Johnson',
        studentGrade: 'Grade 6',
        studentSchool: 'Mona Preparatory',
        parentName: 'Mr. Johnson',
        parentEmail: 'parent2@example.com',
        parentPhone: '876-555-0456',
        status: 'RECEIPT_UPLOADED',
        receiptFilename: 'sample-receipt.png',
        receiptUploadedAt: new Date(),
        referenceNumber: 'TEL-DEMO-002B',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    console.log('✅ Sample booking: Marcus Johnson (Receipt Uploaded — pending approval)');
  }

  // ── Sample Contact Message ──────────────────────────────
  await prisma.contactMessage.create({
    data: {
      name: 'Mrs. Stewart',
      email: 'stewart@example.com',
      phone: '876-555-0789',
      subject: 'Grade 4 comprehension classes',
      message: 'Good afternoon. I am interested in enrolling my daughter in comprehension classes. She is currently in Grade 4 at Meadowbrook Preparatory. Could you please provide more information about the schedule and fees? Thank you.',
    },
  });
  console.log('✅ Sample contact message');

  console.log('\n🎉 Seed complete!\n');
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
  console.log('   Visit: http://localhost:3000\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
