import * as React from 'react';
import axios from 'axios';
import {
  TextField,
  Checkbox,
  Autocomplete,
  AutocompleteInputChangeReason,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

// PROBLEME : COMME NOUVELLES REQUETES, N'ENREGISTRE PAS L'ETAT DES SOLUTIONS ET ON PEUT VALIDER PLUSIEURS FOIS LA MEME OPTION
// PLUSIEURS FOIS LES MEME CHOIX DANS LE FILTRE

function CheckboxesTags(props: {
  label: string;
  getResult: any;
  tableContent: any;
  currentvalue: any;
}) {
  const { label, getResult, tableContent } = props;
  const [options, setOptions] = React.useState<T[]>([]);
  const handleChange = (e, selected) => {
    getResult(selected);
  };

  // const checked = () => {
  //   options.array.forEach((element) => {
  //     if (result.includes(element)) {
  //       element.set('checked', true);
  //     } else {
  //       element.set('checked', false);
  //     }
  //   });
  // };

  React.useEffect(() => {
    axios
      .get<any[]>('/api/group/group/', {
        params: { simple: true, limit: 10 },
      })
      .then((res) => {
        setOptions(res.data.results);
        console.log(res.data);
      });
  }, []);

  const updateOptions = (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason !== 'input' || value.length < 1 || value === null) {
      axios
        .get<any[]>('/api/group/group/', {
          params: { simple: true, limit: 10 },
        })
        .then((res) => {
          setOptions(res.data.results);
          console.log(res.data);
        });
    }
    axios
      .get<any[]>(`/api/group/group/search/`, {
        params: { simple: true, q: value },
      })
      .then((res) => {
        setOptions(res.data);
      });
  };

  return (
    <Autocomplete
      onChange={(e, val, reason) => {
        if (reason === 'selectOption') {
          handleChange(e, val);
        }
      }}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.name} // label displayed on the chips
      onInputChange={updateOptions}
      multiple // enable multiple choices
      clearOnBlur
      limitTags={2} // limit visible chips/tags to 2
      id="size-small-standard"
      size="small"
      disableCloseOnSelect
      renderOption={(content, option, { selected }) => (
        <li {...content}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} name={label} label={label} placeholder={label} />
      )}
    />
  );
}

// function CheckboxesTags(props: {
//   label: string;
//   getResult: any;
//   tableContent: any;
// }) {
//   const { label, getResult, tableContent } = props;

//   const handleChange = (e, selected) => {
//     getResult(selected);
//   };

//   return (
//     <Autocomplete
//       autoComplete
//       multiple
//       clearOnBlur
//       limitTags={2}
//       id="size-small-standard"
//       size="small"
//       options={tableContent}
//       disableCloseOnSelect
//       getOptionLabel={(option) => option.name}
//       renderOption={(content, option, { selected }) => (
//         <li {...content}>
//           <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
//           {option.name}
//         </li>
//       )}
//       onChange={handleChange}
//       renderInput={(params) => (
//         <TextField {...params} label={label} multiline placeholder={label} />
//       )}
//     />
//   );
// }

// export function AutocompleteField<T>(props: {
//   field: FieldType & { kind: 'autocomplete' };
//   value: any;
//   error: any;
//   handleChange: (name: string, value: any) => void;
//   noFullWidth: boolean;
// }) {
//   const { field, value, error, handleChange, noFullWidth } = props;

//   const [options, setOptions] = React.useState<T[]>([]);
//   const [selectedOption, setSelectedOption] = React.useState<T | string>(null);

//   React.useEffect(() => {
//     if (value) {
//       axios
//         .get<T>(`${field.endPoint}/${value}/`)
//         .then((res) => setSelectedOption(res.data));
//     }
//   }, []);

//   function updateOptions(
//     event: React.SyntheticEvent,
//     value: string,
//     reason: AutocompleteInputChangeReason
//   ): void {
//     if (reason !== 'input' || value.length < 3) return;
//     axios
//       .get<any[]>(`${field.endPoint}/search/`, { params: { q: value } })
//       .then((res) => setOptions(res.data))
//       .catch(() => {});
//   }

//   return (
//     <Autocomplete
//       id={`${field.name}-input`}
//       value={selectedOption}
//       onChange={(e, val: T, reason) => {
//         if (reason === 'selectOption') {
//           setSelectedOption(val);
//           handleChange(field.name, val[field.pk || 'id']);
//         }
//       }}
//       options={options}
//       filterOptions={(x) => x}
//       getOptionLabel={field.getOptionLabel}
//       fullWidth={!noFullWidth}
//       freeSolo={field.freeSolo}
//       onInputChange={updateOptions}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           name={field.name}
//           label={field.label}
//           required={field.required}
//           helperText={error || field.helpText}
//           error={!!error}
//           margin="normal"
//         />
//       )}
//     />
//   );
// }

export default CheckboxesTags;
