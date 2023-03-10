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
import { SimpleGroup } from '../../../legacy/group/interfaces';

const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

/**
 * Function to display an Autocomplete with Checkboxes, Tags, and multiple choices
 * @param props described below
 * @returns the autocomplete
 */
function CheckboxesTags<T>(props: {
  label: string; // the label displayed on the component
  getResult: any; // function to get result back into parent component
  updated: boolean; // true if you use a request need to update the content
  request: string; // the request used to get your options from database
  optionsList: Array<T>; // a list of options that you put directly in the Autocomplete
}) {
  const { label, getResult, updated, request, optionsList } = props;
  const [options, setOptions] = React.useState<Array<SimpleGroup>>([]);
  const [chosen, setChosen] = React.useState<Array<SimpleGroup>>([]);

  const handleChange = (selected) => {
    console.log(selected);
    setChosen(selected);
    console.log(chosen);
    getResult(selected);
  };

  React.useEffect(() => {
    if (!updated) {
      setOptions(optionsList);
    } else {
      axios
        .get<any[]>(request, {
          params: { simple: true, limit: 10 },
        })
        .then((res) => {
          setOptions(res.data.results);
        });
    }
  }, []);

  const inChosenFunction = (element: SimpleGroup) => {
    let isThere: boolean;
    isThere = false;
    chosen.forEach((choice) => {
      if (choice.slug === element.slug) {
        isThere = true;
      }
    });
    if (isThere === false) {
      return element;
    }
    return null;
  };

  const updateOptions = (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (
      reason !== 'input' ||
      reason === 'clear' ||
      value.length < 1 ||
      value === null
    ) {
      axios
        .get<any[]>(request, {
          params: { simple: true, limit: 10 },
        })
        .then((res) => {
          setOptions(
            res.data.results.filter((element) => inChosenFunction(element))
          );
        });
    }
    axios
      .get<any[]>(`${request}search/`, {
        params: { simple: true, q: value, limit: 10 },
      })
      .then((res) => {
        setOptions(res.data.filter((element) => inChosenFunction(element)));
        // console.log(chosen);
      });
  };

  return (
    <Autocomplete
      onChange={(e, val, reason) => {
        if (reason === 'selectOption') {
          handleChange(val);
          console.log(val);
        }
        if (reason === 'clear' || reason === 'removeOption') {
          handleChange(val);
          updateOptions(e, val, reason);
        }
      }}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.name} // label displayed on the chips
      onInputChange={updated ? updateOptions : null}
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

export default CheckboxesTags;
