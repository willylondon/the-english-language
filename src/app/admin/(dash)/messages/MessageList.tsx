'use client';
import { useState } from 'react';
import { markMessageRead, deleteMessage } from '@/actions/admin';
import { Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MessageList({ initialMessages }: { initialMessages: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markMessageRead(id);
    router.refresh();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(id);
      router.refresh();
    }
  };

  return (
    <ul className="divide-y divide-slate-200">
      {initialMessages.length === 0 ? (
        <li className="p-6 text-center text-slate-500">No messages found.</li>
      ) : initialMessages.map((msg) => (
        <li key={msg.id} className={`${!msg.isRead ? 'bg-blue-50/50' : 'bg-white'}`}>
          <div 
            className="p-4 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
          >
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium truncate ${!msg.isRead ? 'text-blue-700' : 'text-slate-900'}`}>
                  {msg.name} ({msg.email})
                </p>
                <div className="ml-2 flex-shrink-0 flex text-sm text-slate-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-slate-500">
                    <span className="truncate">{msg.subject}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!msg.isRead && (
                <button 
                  onClick={(e) => handleMarkRead(msg.id, e)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"
                  title="Mark as Read"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={(e) => handleDelete(msg.id, e)}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              {expandedId === msg.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>
          
          {expandedId === msg.id && (
            <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
