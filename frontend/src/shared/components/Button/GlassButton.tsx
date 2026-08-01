import { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type GlassButtonProps = Readonly<{
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  fullWidth?: boolean;
  selected?: boolean;
  to?: string;
}>;

const baseClasses =
  'inline-flex items-center justify-center gap-2 py-2 px-4 border-2 font-bold rounded-3xl active:scale-95 transition-all font-label-lg';

export function GlassButton({
  children,
  onClick,
  className,
  fullWidth,
  selected,
  to,
}: GlassButtonProps) {
  const classes = [
    baseClasses,
    fullWidth ? 'w-full' : '',
    selected
      ? 'bg-primary border-primary-border text-white shadow-sm'
      : 'bg-glass-background border-glass-border text-dark-gray',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link
        aria-current={selected ? 'page' : undefined}
        className={classes}
        onClick={onClick}
        to={to}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
}
