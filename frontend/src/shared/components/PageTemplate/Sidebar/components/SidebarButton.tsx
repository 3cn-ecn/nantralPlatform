import { ReactNode } from 'react';

import { GlassButton } from '#shared/components/Button/GlassButton';
import { useTranslation } from '#shared/i18n/useTranslation';

type SidebarButtonProps = Readonly<{
  children?: ReactNode;
  to: string;
  selected: boolean;
  labelReference: string;
  icon: ReactNode;
  onClick?: () => void;
}>;

export function SidebarButton({
  children,
  to,
  selected,
  labelReference,
  icon,
  onClick,
}: SidebarButtonProps) {
  const { t } = useTranslation();

  return (
    <li>
      <GlassButton
        className="justify-start gap-3 px-3 text-left"
        fullWidth
        onClick={onClick}
        selected={selected}
        to={to}
      >
        <span className="flex size-6 shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate">{t(labelReference)}</span>
        {children}
      </GlassButton>
    </li>
  );
}
