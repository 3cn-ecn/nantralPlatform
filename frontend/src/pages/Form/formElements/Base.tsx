import { ReactNode, useState } from 'react';

import {
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

export function Base({ path, data, handleChange }: any) {
  const [child, setChild] = useState<{ title: string; element: ReactNode }>();
  const children = [{ title: 'VerticalLayout', element: null }];
  const id = path + '/select_type';
  const label = 'Select the type';
  return (
    <Card>
      <CardContent>
        <FormControl sx={{ my: 1 }} fullWidth>
          <InputLabel id={id}>{label}</InputLabel>
          <Select
            variant={'outlined'}
            onChange={(e) =>
              setChild(children.find((c) => c.title === e.target.value))
            }
            label={label}
            labelId={id}
            value={child?.title ?? ''}
          >
            {children.map((child) => (
              <MenuItem key={child.title} value={child.title}>
                {child.title}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Choisissez le type d'élement que vous souhaitez ajouter
          </FormHelperText>
        </FormControl>
      </CardContent>
    </Card>
  );
}
