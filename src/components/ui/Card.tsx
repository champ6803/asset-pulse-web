import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200',
        padding && 'p-6',
        hover && 'hover:shadow-lg transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
}

