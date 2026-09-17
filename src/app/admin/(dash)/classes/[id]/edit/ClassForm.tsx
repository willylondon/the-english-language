'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClass, updateClass } from '@/actions/admin';
import Link from 'next/link';
import type { Programme } from '@/types';

interface ClassFormProps {
  initialData: any;
  isNew: boolean;
  programmes: Programme[];
}

export default function ClassForm({ initialData, isNew, programmes }: ClassFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    programmeId: initialData?.programmeId || (programmes[0]?.id ?? ''),
    title: initialData?.title || '',
    description: initialData?.description || '',
    dayOfWeek: initialData?.dayOfWeek || 'Monday',
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '10:00',
    capacity: initialData?.capacity || 10,
    priceJMD: initialData?.priceJMD || 5000,
    term: initialData?.term || 'Michaelmas 2026',
    meetingLink: initialData?.meetingLink || '',
    isActive: initialData?.isActive ?? true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNew) {
        await createClass(formData);
      } else {
        await updateClass(initialData.id, formData);
      }
      router.push('/admin/classes');
      router.refresh();
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Programme</label>
          <select name="programmeId" value={formData.programmeId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Term</label>
          <input type="text" name="term" value={formData.term} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Day of Week</label>
          <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Price (JMD)</label>
          <input type="number" name="priceJMD" value={formData.priceJMD} onChange={handleChange} required min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Start Time (HH:MM)</label>
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">End Time (HH:MM)</label>
          <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Capacity</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Meeting Link (Zoom/Meet)</label>
          <input type="url" name="meetingLink" value={formData.meetingLink || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="https://zoom.us/j/..." />
        </div>

        <div className="md:col-span-2 flex items-center">
          <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
          <label htmlFor="isActive" className="ml-2 block text-sm text-slate-900">
            Active (visible to students)
          </label>
        </div>
      </div>

      <div className="pt-5 border-t border-slate-200 flex justify-end space-x-3">
        <Link href="/admin/classes" className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Class'}
        </button>
      </div>
    </form>
  );
}
