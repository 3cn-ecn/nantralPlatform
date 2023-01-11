import * as React from 'react';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { isString } from 'lodash';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import formatQuery, { searchApi } from '../../../api';
import './SearchBar.scss';

/** Interface for the options */
interface Option {
  app: string;
  doc: string;
  link: string;
}

/**
 * The Search Bar component, for the global search feature
 *
 * @returns The search component
 */
export function SearchBar(): JSX.Element {
  const [options, setOptions] = React.useState<Option[]>([]);
  const navigate = useNavigate();

  /**
   * A function to update the options when the input value in the search field
   * has changed
   *
   * @param event The event sent when the user change the value
   * @param value The new input value
   * @param reason The reason why the value has changed
   */
  const updateOptions = (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ): void => {
    if (reason !== 'input') {
      return;
    }
    axios
      .get<Option[]>(formatQuery(searchApi, { query: value }))
      .then((res) => {
        // when we get the answer to our request, update the options
        setOptions(res.data);
      })
      .catch(() => {
        // If the request fails, use mock data (with a delay to simulate the request).
        // Only used for tests, delete it when api will be implemented.
        setTimeout(() => {
          setOptions([
            { app: 'group', doc: 'BDE', link: '/group/bde' },
            { app: 'wiki', doc: 'Stages', link: '/wiki/stages' },
            { app: 'event', doc: "Week-end d'intégration", link: '/event/123' },
            { app: '', doc: 'Test page', link: '/test2' },
          ]);
        }, 500);
      });
  };

  /**
   * Action to do when the user validate the search (ie by pressing enter,
   * or by selecting an option).
   *
   * @param event The event of the action
   * @param value The value selected
   * @param reason How the user has validated the form
   */
  const onValidation = (
    event: React.SyntheticEvent,
    value: string | Option,
    reason: AutocompleteChangeReason
  ): void => {
    switch (reason) {
      case 'createOption':
        // the user did'nt select an option but typed a custom text
        navigate(`search/${value as string}`);
        break;
      case 'selectOption':
        // the user select an option
        navigate((value as Option).link);
        break;
      default:
        break;
    }
  };

  return (
    <Autocomplete
      freeSolo
      id="search"
      options={options}
      filterOptions={(x) => x}
      clearOnBlur
      className="search-box"
      getOptionLabel={(option) =>
        isString(option) ? option : `${option.app}:${option.doc}`
      }
      renderOption={(params, option: Option) => (
        // component used for each option
        <li {...params}>
          <span>{option.doc}</span>
          <span className="secondary-text">&nbsp;({option.app})</span>
        </li>
      )}
      renderInput={(params) => (
        // component used for the input
        <ThemeProvider theme={theme}>
          <TextField
            {...params}
            hiddenLabel
            variant="standard"
            size="small"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              placeholder: 'Search',
              className: 'search-input',
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </ThemeProvider>
      )}
      onInputChange={updateOptions}
      onChange={onValidation}
    />
  );
}
