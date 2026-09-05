import { ReactNode, useState } from 'react';

import { Pin } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

import { NumberFieldProps } from '#shared/components/FormFields/NumberField';
import { NumberModal } from '#shared/components/Modal/NumberModal';

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

  return (
    <>
      <MenuItem {...props} onClick={() => setOpen(true)}>
        <ListItemIcon>{icon || <Pin />}</ListItemIcon>
        <ListItemText>
          {label}
          {': '}
          {value ?? '>NULL<'}
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
