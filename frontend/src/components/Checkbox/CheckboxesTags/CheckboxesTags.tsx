import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

// Top 100 films
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
];

function CheckboxesTags(props: { label: string }) {
  const { label } = props;
  return (
    <Autocomplete
      autoComplete
      multiple
      clearOnBlur
      limitTags={2}
      id="size-small-standard"
      size="small"
      options={top100Films}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(content, option, { selected }) => (
        <li {...content}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
          {option.title}
        </li>
      )}
      style={{ width: 230 }}
      renderInput={(params) => (
        <TextField {...params} label={label} multiline placeholder={label} />
      )}
    />
  );
}

export default CheckboxesTags;
