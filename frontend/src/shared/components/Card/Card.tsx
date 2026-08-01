import { ReactNode } from 'react';

type CardProps = Readonly<{
  children?: ReactNode;
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-card-glass border-2 border-card-glass-border rounded-3xl m-4 ${className || ''}`}
    >
      {children}
    </div>
  );
}
