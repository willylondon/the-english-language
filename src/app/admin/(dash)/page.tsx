import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Users, Receipt, CalendarCheck, DollarSign, ArrowRight, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Admin',
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch stats concurrently
  const [
    totalStudents,
    pendingPayments,
    activeClasses,
    recentBookings,
    revenueData
  ] = await Promise.all([
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'RECEIPT_UPLOADED' } }),
    prisma.class.count({ where: { isActive: true } }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { class: true }
    }),
    // Calculate current month's revenue (rough approximation via DB)
    prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      include: { class: { select: { priceJMD: true } } }
    })
  ]);

  const monthlyRevenue = revenueData.reduce((acc, curr) => acc + (curr.class?.priceJMD ?? 0), 0);
  const attentionRequired = recentBookings.filter(b => b.status === 'RECEIPT_UPLOADED');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Welcome back, Admin</h1>
        <p className="mt-2 text-slate-600">Here&apos;s what&apos;s happening with your tutoring classes.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl shadow-sm border ${pendingPayments > 0 ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Payments</p>
              <p className={`text-2xl font-semibold mt-1 ${pendingPayments > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {pendingPayments}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${pendingPayments > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Classes</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{activeClasses}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">This Month&apos;s Revenue</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{formatPrice(monthlyRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column (wider) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attention Required */}
          {attentionRequired.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-amber-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Requires Attention
                </h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {attentionRequired.map(booking => (
                  <li key={booking.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900">{booking.studentName}</p>
                      <p className="text-sm text-slate-500">{booking.class.title} — {booking.referenceNumber}</p>
                    </div>
                    <Link href={`/admin/bookings?ref=${booking.referenceNumber}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
                      Review Receipt
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{booking.studentName}</div>
                        <div className="text-sm text-slate-500">{booking.parentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{booking.class.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'RECEIPT_UPLOADED' ? 'bg-amber-100 text-amber-800' :
                            booking.status === 'PENDING_PAYMENT' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/classes/new" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Add New Class
              </Link>
              <Link href="/admin/bookings" className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                Manage Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
