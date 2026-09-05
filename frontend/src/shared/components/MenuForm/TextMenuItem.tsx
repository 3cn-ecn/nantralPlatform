import { ReactNode, useState } from 'react';

import { Abc } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
} from '@mui/material';

import { TextFieldProps } from '#shared/components/FormFields';
import { TextModal } from '#shared/components/Modal/TextModal';

export interface TextMenuItemProps extends MenuItemProps {
  handleChange: (val: string) => void;
  label: string;
  helperText?: string;
  icon?: ReactNode;
  slotProps?: { input?: Partial<TextFieldProps> };
}

export function TextMenuItem({
  value,
  handleChange,
  helperText,
  label,
  icon,
  slotProps,
  ...props
}: TextMenuItemProps & { value?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MenuItem {...props} onClick={() => setOpen(true)}>
        <ListItemIcon>{icon || <Abc />}</ListItemIcon>
        <ListItemText>
          {label}
          {': '}
          {value ?? '>NULL<'}
        </ListItemText>
      </MenuItem>
      {open && (
        <TextModal
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
