import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, BookOpen, Globe, Award, PenTool, Search, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { cn, getProgrammeColor, getSeatsRemaining, PROGRAMME_DATA, formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Expert English & Literature Tutoring in Jamaica. Specialized in CSEC English A & B (Literature), IGCSE, and IB English.',
};

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-8 w-8" />,
  BookOpen: <BookOpen className="h-8 w-8" />,
  Globe: <Globe className="h-8 w-8" />,
  Award: <Award className="h-8 w-8" />,
  PenTool: <PenTool className="h-8 w-8" />,
  Search: <Search className="h-8 w-8" />,
};

export default async function HomePage() {
  const activeClasses = await prisma.class.findMany({
    where: { isActive: true },
    include: { programme: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const blogPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white section-padding overflow-hidden">
        <div className="container-main relative z-10 text-center">
          <h1 className="heading-1 font-serif text-white mb-6">
            Expert English & Literature Tutoring
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
            Specialized instruction for CSEC English A, CSEC English B (Literature), IGCSE, and IB examinations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/classes" className="btn-primary px-8 py-4 text-lg">
              Book an English Class
            </Link>
            <Link href="/programmes" className="btn-secondary bg-transparent px-8 py-4 text-lg border-white text-white hover:bg-white/10">
              Explore Programmes
            </Link>
          </div>
        </div>
      </section>

      {/* Programme Cards */}
      <section className="bg-slate-50 section-padding">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-2 font-serif">Our Programmes</h2>
            <p className="body-text mt-4">Tailored curriculum for every stage of learning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROGRAMME_DATA.map((prog) => {
              const color = getProgrammeColor(prog.color || prog.slug);
              return (
                <div key={prog.slug} className={cn("card p-6 flex flex-col h-full border-t-4", color.border)}>
                  <div className={cn("mb-4", color.text)}>{iconMap[prog.icon] || <BookOpen className="h-8 w-8" />}</div>
                  <h3 className="heading-3 mb-2">{prog.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{prog.tagline} • Ages {prog.ageRange}</p>
                  <p className="body-text flex-grow">{prog.description}</p>
                  <Link href={`/programmes/${prog.slug}`} className="mt-6 text-blue-600 font-semibold hover:underline">
                    Learn More &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="heading-2 text-center font-serif mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Small Group Classes</h3>
              <p className="body-text">Maximum of 8 students per class ensures personalized attention and active participation.</p>
            </div>
            <div>
              <div className="mx-auto bg-amber-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exam-Focused Expertise</h3>
              <p className="body-text">Specialized training for CSEC, CAPE, Cambridge IGCSE, and IB English requirements.</p>
            </div>
            <div>
              <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Online Learning</h3>
              <p className="body-text">Engaging live sessions via Zoom/Google Meet accessible from anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Classes */}
      <section className="bg-slate-50 section-padding">
        <div className="container-main">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="heading-2 font-serif">Upcoming Classes</h2>
              <p className="body-text mt-2">Secure your spot in our active sessions</p>
            </div>
            <Link href="/classes" className="hidden sm:block text-blue-600 font-semibold hover:underline">
              View All Classes &rarr;
            </Link>
          </div>
          
          {activeClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeClasses.map((cls) => {
                const seatsRemaining = getSeatsRemaining(cls.capacity, cls.enrolledCount);
                const color = getProgrammeColor(cls.programme.color || cls.programme.slug);
                return (
                  <div key={cls.id} className="card p-5 flex flex-col">
                    <span className={cn("badge self-start mb-3", color.badge)}>
                      {cls.programme.name}
                    </span>
                    <h3 className="font-bold text-lg mb-2">{cls.title}</h3>
                    <div className="text-sm text-slate-600 mb-4 space-y-1 flex-grow">
                      <p>{`${cls.dayOfWeek}s`}</p>
                      <p>{cls.startTime} - {cls.endTime}</p>
                      <p className="font-semibold text-slate-900 mt-2">{formatPrice(cls.priceJMD)}</p>
                    </div>
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="text-slate-500">{seatsRemaining} seats left</span>
                    </div>
                    {seatsRemaining > 0 ? (
                      <Link href={`/book/${cls.id}`} className="btn-primary w-full text-center py-2">
                        Book Now
                      </Link>
                    ) : (
                      <span className="bg-slate-200 text-slate-500 w-full text-center py-2 rounded-md font-semibold">
                        Full
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
              <p className="body-text">No classes available at the moment. Please check back later.</p>
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/classes" className="text-blue-600 font-semibold hover:underline">
              View All Classes &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding">
          <div className="container-main">
            <h2 className="heading-2 text-center font-serif mb-12">What Parents Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="card p-6 bg-blue-50/50">
                  <div className="flex mb-4 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                  </div>
                  <p className="text-slate-700 italic mb-6">&ldquo;{t.content}&rdquo;</p>
                  <div>
                    <p className="font-bold text-slate-900">{t.parentName}</p>
                    {t.programme && <p className="text-sm text-slate-500 mt-1">{t.programme}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="bg-slate-50 section-padding">
          <div className="container-main">
            <h2 className="heading-2 text-center font-serif mb-12">Latest Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {blogPosts.map((post) => (
                <div key={post.id} className="card p-6">
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-slate-600 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 font-semibold hover:underline">
                    Read More &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-amber-500 section-padding text-center">
        <div className="container-main">
          <h2 className="heading-2 font-serif text-slate-900 mb-6">Ready to excel in English?</h2>
          <Link href="/classes" className="btn-primary bg-slate-900 hover:bg-slate-800 px-8 py-4 text-lg">
            Book an English Class
          </Link>
        </div>
      </section>
    </div>
  );
}
