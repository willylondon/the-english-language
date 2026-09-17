'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, getSeatsRemaining, getProgrammeColor, formatPrice } from '@/lib/utils';
import type { ClassWithProgramme } from '@/types';

type ProgrammeFilter = {
  id: string;
  name: string;
  slug: string;
};

interface ClassesFilterProps {
  initialClasses: ClassWithProgramme[];
  programmes: ProgrammeFilter[];
}

export default function ClassesFilter({ initialClasses, programmes }: ClassesFilterProps) {
  const [selectedProgramme, setSelectedProgramme] = useState<string>('all');

  const filteredClasses = selectedProgramme === 'all'
    ? initialClasses
    : initialClasses.filter(c => c.programme.slug === selectedProgramme);

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          onClick={() => setSelectedProgramme('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedProgramme === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Programmes
        </button>
        {programmes.map(prog => (
          <button
            key={prog.id}
            onClick={() => setSelectedProgramme(prog.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedProgramme === prog.slug
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {prog.name}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const seats = getSeatsRemaining(cls.capacity, cls.enrolledCount);
            const color = getProgrammeColor(cls.programme.color || cls.programme.slug);
            
            // Urgency color
            let urgencyColor = 'text-green-600';
            if (seats === 0) urgencyColor = 'text-red-600';
            else if (seats <= 2) urgencyColor = 'text-amber-600';

            return (
              <div key={cls.id} className="card p-6 flex flex-col hover:shadow-md transition-shadow">
                <span className={cn("badge self-start mb-4", color.badge)}>
                  {cls.programme.name}
                </span>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cls.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                  {cls.description}
                </p>
                
                <div className="bg-slate-50 p-4 rounded-md mb-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Schedule:</span>
                    <span className="font-semibold text-slate-900">{`${cls.dayOfWeek}s`}, {cls.startTime}-{cls.endTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Price:</span>
                    <span className="font-semibold text-slate-900">{formatPrice(cls.priceJMD)} / term</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 mt-2">
                    <span className="text-slate-500 font-medium">Availability:</span>
                    <span className={`font-semibold ${urgencyColor}`}>
                      {seats} of {cls.capacity} seats left
                    </span>
                  </div>
                </div>

                {seats > 0 ? (
                  <Link href={`/book/${cls.id}`} className="btn-primary w-full text-center py-3">
                    Book This Class
                  </Link>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3 rounded-md font-semibold cursor-not-allowed">
                    Class Full
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-lg text-slate-600">No classes found for the selected programme.</p>
          <button 
            onClick={() => setSelectedProgramme('all')}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            View all classes
          </button>
        </div>
      )}
    </div>
  );
}
