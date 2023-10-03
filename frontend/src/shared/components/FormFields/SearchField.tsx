import { memo, useCallback } from 'react';

import { Search as SearchIcon } from '@mui/icons-material';
import { debounce } from 'lodash-es';

import { TextField, TextFieldProps } from './TextField';

export type SearchFieldProps = TextFieldProps;

function SearchFieldComponent({
  value,
  handleChange,
  ...props
}: SearchFieldProps) {
  const debouncedHandleChange = debounce(
    (val: string) => handleChange(val),
    300,
  );

  const handleHandleChange = useCallback(
    (val: string) => {
      debouncedHandleChange(val);
    },
    [debouncedHandleChange],
  );

  return (
    <TextField
      defaultValue={value}
      handleChange={handleHandleChange}
      InputProps={{ endAdornment: <SearchIcon /> }}
      {...props}
    />
  );
}

export const SearchField = memo(SearchFieldComponent);
