import React from 'react';
import { FileCheck } from 'lucide-react';

export interface DataReviewIconProps {
  className?: string;
  isInverse?: boolean;
}

export const DataReviewIcon: React.FC<DataReviewIconProps> = ({
  className = 'w-4 h-4',
}) => {
  return <FileCheck className={className} />;
};
