import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogForm from './BlogForm';

export default async function EditBlogPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const isNew = params.id === 'new';
  let postData = null;

  if (!isNew) {
    postData = await prisma.blogPost.findUnique({
      where: { id: params.id }
    });

    if (!postData) {
      redirect('/admin/blog');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">
          {isNew ? 'Create New Post' : 'Edit Post'}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <BlogForm initialData={postData} isNew={isNew} />
      </div>
    </div>
  );
}
