'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleClassActive } from '@/actions/admin';
import { Power, PowerOff, Loader2 } from 'lucide-react';

export default function ToggleClassButton({ id, isActive }: { id: string, isActive: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await toggleClassActive(id);
      router.refresh();
    } catch (error) {
      console.error('Error toggling class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center p-1.5 border rounded-md disabled:opacity-50 ${isActive ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'}`}
      title={isActive ? 'Deactivate Class' : 'Activate Class'}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />)}
    </button>
  );
}
