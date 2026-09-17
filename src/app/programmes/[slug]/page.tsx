import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PROGRAMME_DATA, getProgrammeColor, getSeatsRemaining, formatPrice, cn } from '@/lib/utils';

export async function generateStaticParams() {
  return PROGRAMME_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const programme = PROGRAMME_DATA.find((p) => p.slug === params.slug);
  if (!programme) return { title: 'Programme Not Found' };
  
  return {
    title: `${programme.name} Preparation`,
    description: programme.description,
  };
}

export default async function ProgrammeDetailPage({ params }: { params: { slug: string } }) {
  const programme = PROGRAMME_DATA.find((p) => p.slug === params.slug);
  if (!programme) notFound();

  const color = getProgrammeColor(programme.color || programme.slug);

  const activeClasses = await prisma.class.findMany({
    where: { 
      programme: { slug: programme.slug },
      isActive: true,
    },
    include: { programme: true },
    orderBy: { createdAt: 'desc' },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: programme.name,
    description: programme.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'The English Language',
      sameAs: 'https://theenglishlanguage.com.jm'
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb */}
      <div className="bg-slate-50 py-3 border-b border-slate-200">
        <div className="container-main flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/programmes" className="hover:text-blue-600">Programmes</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-slate-900">{programme.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className={cn("section-padding border-b border-slate-200", color.bg)}>
        <div className="container-main max-w-4xl mx-auto text-center">
          <div className={cn("inline-block px-3 py-1 rounded-full bg-white border shadow-sm text-sm font-bold mb-6", color.text, color.border)}>
            {programme.examBoard} • Ages {programme.ageRange}
          </div>
          <h1 className="heading-1 font-serif mb-4">{programme.name}</h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">{programme.tagline}</p>
        </div>
      </section>

      <div className="container-main max-w-5xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="heading-2 font-serif mb-6">About this Programme</h2>
          <div className="prose prose-lg text-slate-700 mb-10">
            <p>{programme.description}</p>
          </div>

          <h2 className="heading-2 font-serif mb-6">What You&apos;ll Learn</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programme.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className={cn("h-6 w-6 mr-3 flex-shrink-0", color.text)} />
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 bg-slate-50 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Available Classes</h3>
            {activeClasses.length > 0 ? (
              <div className="space-y-4">
                {activeClasses.map((cls) => {
                  const seats = getSeatsRemaining(cls.capacity, cls.enrolledCount);
                  return (
                    <div key={cls.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-1">{cls.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{`${cls.dayOfWeek}s`}, {cls.startTime}-{cls.endTime}</p>
                      <p className="font-semibold text-slate-900 mb-3">{formatPrice(cls.priceJMD)}</p>
                      <p className="text-xs text-slate-500 mb-3">{seats} seats remaining</p>
                      {seats > 0 ? (
                        <Link href={`/book/${cls.id}`} className="btn-primary w-full text-center py-2 block text-sm">
                          Book This Class
                        </Link>
                      ) : (
                        <span className="block w-full text-center py-2 bg-slate-200 text-slate-500 rounded text-sm font-semibold">
                          Full
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-600 text-sm">No active classes currently available for this programme.</p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="mt-20 section-padding bg-slate-900 text-white text-center">
        <div className="container-main">
          <h2 className="heading-2 font-serif text-white mb-6">Ready to start?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Join our comprehensive {programme.name} preparation classes today.</p>
          <Link href="/classes" className="btn-accent px-8 py-4 text-lg">
            View All Classes
          </Link>
        </div>
      </section>
    </div>
  );
}
