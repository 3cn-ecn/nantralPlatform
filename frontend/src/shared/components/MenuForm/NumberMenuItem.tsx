import { ReactNode, useState } from 'react';

import { Pin } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
  Typography,
} from '@mui/material';

import { NumberFieldProps } from '#shared/components/FormFields/NumberField';
import { NumberModal } from '#shared/components/Modal/NumberModal';
import { useTranslation } from '#shared/i18n/useTranslation';

export interface NumberMenuItemProps extends MenuItemProps {
  handleChange: NumberFieldProps['handleChange'];
  label: NumberFieldProps['label'];
  helperText?: NumberFieldProps['helperText'];
  icon?: ReactNode;
  slotProps?: { input?: Partial<NumberFieldProps> };
}

export function NumberMenuItem({
  value,
  handleChange,
  helperText,
  label,
  icon,
  slotProps,
  ...props
}: NumberMenuItemProps & { value?: number }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <MenuItem {...props} onClick={() => setOpen(true)}>
        <ListItemIcon>{icon || <Pin />}</ListItemIcon>
        <ListItemText>
          {label}
          {': '}
          {value ?? (
            <Typography color={'textDisabled'}>
              {t('form.menu.empty')}
            </Typography>
          )}
        </ListItemText>
      </MenuItem>
      {open && (
        <NumberModal
          label={label}
          helperText={helperText}
          onCancel={() => setOpen(false)}
          onConfirm={(val) => {
            setOpen(false);
            handleChange(val);
          }}
          oldValue={value}
          {...slotProps?.input}
        />
      )}
    </>
  );
}
