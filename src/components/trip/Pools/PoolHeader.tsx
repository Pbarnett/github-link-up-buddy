
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PoolHeaderProps {
  name: string;
  count: number;
}

const PoolHeader: React.FC<PoolHeaderProps> = ({ name, count }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{name}</h3>
      <Badge variant="secondary">{count} offers</Badge>
    </div>
  );
};

export default PoolHeader;
