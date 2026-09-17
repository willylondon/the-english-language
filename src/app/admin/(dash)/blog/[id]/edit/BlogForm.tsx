'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrUpdateBlogPost } from '@/actions/admin';
import Link from 'next/link';

export default function BlogForm({ initialData, isNew }: { initialData: any, isNew: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    metaDescription: initialData?.metaDescription || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    isPublished: initialData?.isPublished || false
  });

  // Auto-generate slug from title if it's a new post and slug hasn't been manually edited much
  useEffect(() => {
    if (isNew && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
          .join(',')
      };
      
      await createOrUpdateBlogPost(isNew ? null : initialData.id, submitData);
      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Slug</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Excerpt</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={2} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Content (Markdown supported)</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required rows={15} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Meta Description</label>
          <input type="text" name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Tags (comma-separated)</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="education, grammar, tips" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="md:col-span-2 flex items-center">
          <input type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-slate-900">
            Publish immediately
          </label>
        </div>
      </div>

      <div className="pt-5 border-t border-slate-200 flex justify-end space-x-3">
        <Link href="/admin/blog" className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}
