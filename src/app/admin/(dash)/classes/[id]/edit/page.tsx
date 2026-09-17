import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ClassForm from './ClassForm'; // Will create this below

export default async function EditClassPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const isNew = params.id === 'new';
  let classData = null;

  if (!isNew) {
    classData = await prisma.class.findUnique({
      where: { id: params.id }
    });

    if (!classData) {
      redirect('/admin/classes');
    }
  }

  const programmes = await prisma.programme.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">
          {isNew ? 'Create New Class' : 'Edit Class'}
        </h1>
        <p className="mt-2 text-slate-600">
          {isNew ? 'Add a new tutoring class to your schedule.' : 'Update the details for this class.'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <ClassForm initialData={classData} isNew={isNew} programmes={programmes} />
      </div>
    </div>
  );
}
