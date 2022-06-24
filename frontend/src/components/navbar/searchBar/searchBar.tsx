import * as React from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { SEARCH_API } from '../../../api';
import axios from '../../../utils/axios';

/**
 * The Search Bar component, for the global search feature
 *
 * @returns The search component
 */
export function SearchBar(): JSX.Element {
  const [options, setOptions] = React.useState([]);

  /**
   * A function to update the options when the input value in the search field
   * has changed
   *
   * @param event The event sent when the user change the value
   */
  const updateOptions = (event) => {
    axios
      .post<any[]>(SEARCH_API, { searchInput: event.target.value })
      .then((res) => {
        // when we get the answer to our request, update the options
        setOptions(res.data);
      })
      .catch(() => {
        // if the request fails, use mock data (with a delay to simulate the request)
        setTimeout(() => {
          setOptions([
            { value: 'abc', link: '/abc' },
            { value: 'def', link: '/def' },
            { value: 'ghi', link: '/ghi' },
          ]);
        }, 500);
      });
  };

  return (
    <Autocomplete
      freeSolo
      id="search"
      options={options}
      filterOptions={(x) => x}
      sx={{ flexGrow: 1 }}
      renderInput={(params) => (
        // component used for the input
        <TextField
          {...params}
          onChange={updateOptions}
          label="Search"
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
      renderOption={(params, option) => (
        // component used for each result
        // TODO: the link does not work because of the params on <li>
        <li {...params}>
          <Link to={option.link}>{option.value}</Link>
        </li>
      )}
    />
  );
}
