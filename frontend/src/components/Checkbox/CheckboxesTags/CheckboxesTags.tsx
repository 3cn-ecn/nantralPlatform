import React from 'react';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import axios from 'axios';

import { Page } from '#types/Group';
import Avatar from '../../Avatar/Avatar';

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
  value: Array<T>;
  updated: boolean; // true if you use a request need to update the content
  request: string; // the request used to get your options from database
  optionsList: Array<T>; // a list of options that you put directly in the Autocomplete
  pkField: string; // field of option used as primary key
  labelField: string; // field of option displayed in autocomplete
}) {
  const {
    label,
    getResult,
    updated,
    request,
    optionsList,
    pkField,
    labelField,
    value,
  } = props;
  const [options, setOptions] = React.useState<Array<T>>([]); // options displayed
  const [chosen, setChosen] = React.useState<Array<T>>([]); // options chosen
  const [reload, setReload] = React.useState(false); // boolean : true if the options need to be reloaded

  const handleChange = (selected) => {
    setChosen(selected);
    getResult(selected);
  };

  React.useEffect(() => {
    setChosen(value);
    console.log(value);
    setReload(true);
  }, [value]);
  console.log(options, chosen);
  // function used to know if an element is in chosen. Returns null if it is, the element if not.
  const inChosenFunction = (element: T) => {
    let isThere: boolean;
    isThere = false;
    chosen.forEach((choice) => {
      if (choice[pkField] === element[pkField]) {
        isThere = true;
      }
    });
    if (isThere === false) {
      return element;
    }
    return null;
  };

  // function used to get the elements for options when component is created
  React.useEffect(() => {
    if (!updated) {
      setOptions(optionsList);
    } else {
      axios
        .get<Page<T>>(request, {
          params: { simple: true, limit: 10 },
        })
        .then((res) => {
          setOptions(res.data.results);
        });
    }
  }, []);

  // function used to update options of the autocomplete. It filters options depending on chosen.
  const updateOptions = (event: React.SyntheticEvent, newValue: string) => {
    axios
      .get<T[]>(`${request}search/`, {
        params: { simple: true, q: newValue, limit: 10 },
      })
      .then((res) => {
        setOptions(res.data.filter((element) => inChosenFunction(element)));
      });
  };

  // forces to wait until chosen is updated before calling updateOptions
  React.useEffect(() => {
    if (reload) {
      updateOptions(null, null);
      setReload(false);
    }
  }, [chosen]);

  return (
    <Autocomplete
      onChange={(e, val, reason) => {
        if (
          reason === 'selectOption' ||
          reason === 'clear' ||
          reason === 'removeOption'
        ) {
          handleChange(val);
          if (updated) {
            setReload(true); // options need to be reloaded
          }
        }
      }}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option[labelField]} // label displayed on the chips
      onInputChange={updated ? updateOptions : null}
      multiple // enable multiple choices
      clearOnBlur
      limitTags={2} // limit visible chips/tags to 2
      id="size-small-standard"
      size="small"
      disableCloseOnSelect
      renderOption={(content, option, { selected }) => (
        <li {...content}>
          {/* <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} /> */}
          {/* <Avatar title={option?.name} url={option?.icon} size="small" /> */}
          {option[labelField]}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} name={label} label={label} placeholder={label} />
      )}
    />
  );
}

export default CheckboxesTags;
