
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-12">
      <FolderOpen className="w-8 h-8 mb-3 text-gray-400" />
      {children}
    </div>
  );
}
