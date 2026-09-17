'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleTestimonialPublished } from '@/actions/admin';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function TestimonialActions({ id, isPublished }: { id: string, isPublished: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await toggleTestimonialPublished(id);
      router.refresh();
    } catch (error) {
      console.error('Error toggling testimonial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="inline-flex items-center p-1.5 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
      title={isPublished ? 'Unpublish' : 'Publish'}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />)}
    </button>
  );
}
