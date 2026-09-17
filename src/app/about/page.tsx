import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Target, MessageSquare, Heart, GraduationCap, Award, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | The English Language',
  description: 'Learn about our teaching philosophy, methodology, and experienced educators dedicated to student success in English.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-slate-900 text-white py-20">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About The English Language</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Empowering students across Jamaica to master the English language and achieve academic excellence.
          </p>
        </div>
      </section>

      <div className="container-main section-padding">
        <section className="mb-24 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-xl border-4 border-white">
              <Image 
                src="/farika.webp" 
                alt="Farika Atkins — Lead Educator & Curriculum Specialist" 
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-3">
              Lead Educator & Curriculum Strategist
            </div>
            <h2 className="heading-2 mb-2 font-serif">Farika Atkins</h2>
            <p className="text-blue-600 font-medium mb-6">English Education Leader • Grades 4–13 Specialist</p>
            <div className="prose prose-slate max-w-none space-y-4 text-slate-700 text-lg leading-relaxed">
              <p>
                &ldquo;My work centers on rigorous instruction, inclusive practice, and long-term student growth. Whether preparing a student for high-stakes examinations or cultivating lifelong reading and composition skills, I believe in structured guidance combined with personal encouragement.&rdquo;
              </p>
              <p className="text-base text-slate-600">
                With deep expertise spanning CXC regional examinations (CSEC English A, CSEC English B Literature, CAPE Literatures in English) as well as international frameworks (Cambridge IGCSE and IB Diploma), Farika partners with students and parents to build confidence, analytical depth, and exam mastery.
              </p>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-slate-900 mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {['CSEC English B (Literature)', 'CSEC English A', 'CAPE Literatures in English', 'IGCSE First Language', 'IB English A (Lit & Lang/Lit)', 'Essay Writing & SBA Coaching', 'Textual Analysis & Comprehension'].map(spec => (
                  <span key={spec} className="badge bg-blue-50 text-blue-700 border border-blue-200">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-6 text-sm text-slate-600">
              <a href="https://farikaatkins.online" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                View Farika&apos;s Full Portfolio &rarr;
              </a>
              <a href="mailto:farikaatkins@gmail.com" className="text-slate-600 hover:text-blue-600">
                farikaatkins@gmail.com
              </a>
              <a href="tel:+18762952776" className="text-slate-600 hover:text-blue-600">
                +1 (876) 295-2776
              </a>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="heading-2 text-center mb-12">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Small Groups</h3>
              <p className="text-slate-600">Maximum 8 students per class ensures personalized attention and targeted feedback.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Exam-Focused</h3>
              <p className="text-slate-600">Methodologies tailored specifically to CSEC, CAPE, and IB examination requirements.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Parent Updates</h3>
              <p className="text-slate-600">Regular progress reports and open communication channels with parents.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Supportive Space</h3>
              <p className="text-slate-600">An encouraging environment where students feel confident to express ideas and ask questions.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 rounded-3xl p-12 mb-20 text-center border border-slate-200">
          <h2 className="heading-2 mb-10">Qualifications & Experience</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
              <GraduationCap className="text-blue-600 w-6 h-6" />
              <span className="font-medium text-slate-800">Master of Arts in Education</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
              <BookOpen className="text-blue-600 w-6 h-6" />
              <span className="font-medium text-slate-800">BA English Literature</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
              <Award className="text-blue-600 w-6 h-6" />
              <span className="font-medium text-slate-800">Certified Educator</span>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="heading-2 mb-6">Ready to start your journey?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful students who have improved their grades and confidence with our structured programmes.
          </p>
          <Link href="/classes" className="btn-primary text-lg px-8 py-4">
            Book a session with us
          </Link>
        </section>
      </div>
    </main>
  );
}
