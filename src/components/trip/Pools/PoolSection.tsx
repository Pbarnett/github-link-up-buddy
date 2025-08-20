
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import PoolHeader from './PoolHeader';

interface PoolSectionProps {
  name: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const PoolSection: React.FC<PoolSectionProps> = ({
  name,
  count,
  defaultOpen = false,
  children
}) => {
  return (
    <Collapsible defaultOpen={defaultOpen} className="w-full">
      <CollapsibleTrigger className="w-full p-4 hover:bg-gray-50 rounded-lg">
        <PoolHeader name={name} count={count} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        {count === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No options in this category.
          </div>
        ) : (
          children
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PoolSection;
