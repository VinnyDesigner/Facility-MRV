import React from 'react';
import { FileSearch } from 'lucide-react';

export interface DataReviewIconProps {
  className?: string;
  isInverse?: boolean;
}

export const DataReviewIcon: React.FC<DataReviewIconProps> = ({
  className = 'w-4 h-4',
}) => {
  return <FileSearch className={className} />;
};
