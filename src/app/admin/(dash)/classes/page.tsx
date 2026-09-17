import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit2 } from 'lucide-react';
import { formatPrice, formatTime } from '@/lib/utils';
import ToggleClassButton from './ToggleClassButton'; // Extracted client component for toggling

export const metadata: Metadata = {
  title: 'Manage Classes — Admin',
};

export default async function ClassesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const classes = await prisma.class.findMany({
    include: { programme: true },
    orderBy: [{ programme: { order: 'asc' } }, { dayOfWeek: 'asc' }]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Manage Classes</h1>
        <Link 
          href="/admin/classes/new/edit" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Class
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {classes.map((cls) => {
                const fillPercentage = (cls.enrolledCount / cls.capacity) * 100;
                let barColor = 'bg-green-500';
                if (fillPercentage >= 80) barColor = 'bg-red-500';
                else if (fillPercentage >= 50) barColor = 'bg-amber-500';

                return (
                  <tr key={cls.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{cls.title}</div>
                      <div className="text-sm text-slate-500">{cls.programme.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{cls.dayOfWeek}</div>
                      <div className="text-sm text-slate-500">{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div className={`h-2.5 rounded-full ${barColor}`} style={{ width: `${Math.min(fillPercentage, 100)}%` }}></div>
                        </div>
                        <span className="text-sm text-slate-600">{cls.enrolledCount}/{cls.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatPrice(cls.priceJMD)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cls.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {cls.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <ToggleClassButton id={cls.id} isActive={cls.isActive} />
                      <Link href={`/admin/classes/${cls.id}/edit`} className="inline-flex items-center p-1.5 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
