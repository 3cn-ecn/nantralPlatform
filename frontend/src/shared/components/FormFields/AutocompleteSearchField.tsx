import { SyntheticEvent, memo, useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  AutocompleteProps,
  ChipTypeMap,
  CircularProgress,
  AutocompleteValue as MuiAutocompleteValue,
  TextField,
} from '@mui/material';
import { debounce, isNil } from 'lodash-es';

import { useTranslation } from '#shared/i18n/useTranslation';

import { Avatar } from '../Avatar/Avatar';
import { FlexRow } from '../FlexBox/FlexBox';

// just a function to make typescript work
function isMultiple<T, Multiple extends boolean>(
  objectValue: T[] | T,
  multiple: Multiple
): objectValue is T[] {
  return multiple;
}

// duplicate the type to have 3 arguments instead of 4 (the last one is not used)
// this is just an alias for: T | T[]
// (but it takes into account the 'multiple' boolean props to decide)
type AutocompleteValue<T, Multiple, DisableClearable> = MuiAutocompleteValue<
  T,
  Multiple,
  DisableClearable,
  false
>;

// the type of the props for our Autocomplete component
// Omit<.., ...> duplicate the type from MUI and remove some properties
// and then we add our custom properties
type AutocompleteSearchFieldProps<
  T,
  Multiple extends boolean,
  DisableClearable extends boolean,
  ChipComponent extends React.ElementType
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, false, ChipComponent>,
  | 'error'
  | 'options'
  | 'value'
  | 'freeSolo'
  | 'defaultValue'
  | 'onChange'
  | 'filterOptions'
  | 'onInputChange'
  | 'renderInput'
> & {
  value: AutocompleteValue<number, Multiple, DisableClearable>;
  onChange: (
    value: AutocompleteValue<number, Multiple, DisableClearable>
  ) => void;
  defaultObjectValue?: AutocompleteValue<T, Multiple, DisableClearable>;
  fetchInitialOptions?: () => Promise<T[]>;
  fetchOptions: (inputValue: string) => Promise<T[]>;
  name?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  errors?: string[];
  labelPropName: keyof T;
  imagePropName?: keyof T;
};

/**
 * A custom Autocomplete field for searching elements like Group or Student on
 * our django REST API.
 *
 * @param value - The id of the element selected
 * @param onChange - When the selected element id is updated
 * @param defaultObjectValue - The default value, but the whole object (not just the id)
 * @param fetchInitialOptions - Fetch a list of initial elements, only fetch when the field is empty
 * @param fetchOptions - Fetch a list of elements, according to a search text
 * @param name - The name of the field for the HTML form
 * @param label - The label of the field
 * @param helperText - The helper text for the field
 * @param required - If the field is required or not
 * @param errors - A list of error messages, if any
 * @param fullWidth - If the field takes the full width of the container or not
 * @param multiple - If user can select multiple elements or just one
 * @param getOptionLabel - A function to render the label of an element
 * @param getOptionImage - A function to get the image url of an element
 */
function AutocompleteSearchFieldComponent<
  T extends { id: number },
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
>({
  value,
  onChange,
  defaultObjectValue,
  fetchInitialOptions,
  fetchOptions,
  name,
  label,
  helperText,
  required = false,
  errors,
  fullWidth = true,
  multiple,
  labelPropName,
  imagePropName,
  ...props
}: AutocompleteSearchFieldProps<T, Multiple, DisableClearable, ChipComponent>) {
  const { t } = useTranslation();

  const [options, setOptions] = useState<T[]>([]);
  const [objectValue, setObjectValue] =
    useState<AutocompleteValue<T, Multiple, DisableClearable>>(
      defaultObjectValue
    );
  const [isLoading, setIsLoading] = useState(false);
  const isError = errors !== undefined;

  useEffect(() => {
    if (fetchInitialOptions && isNil(value)) {
      setIsLoading(true);
      fetchInitialOptions()
        .then((data) => {
          setOptions(data);
          setIsLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [fetchInitialOptions, value]);

  const updateOptions = debounce(
    (
      event: React.SyntheticEvent,
      inputValue: string,
      reason: AutocompleteInputChangeReason
    ): void => {
      if (reason !== 'input' || !inputValue) return;
      setIsLoading(true);
      fetchOptions(inputValue)
        .then((data) => {
          setOptions(data);
          setIsLoading(false);
        })
        .catch((err) => console.error(err));
    },
    300
  );

  const updateValue = (
    event: SyntheticEvent,
    newObjectValue: AutocompleteValue<T, Multiple, DisableClearable>,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === 'selectOption') {
      setObjectValue(newObjectValue);
      onChange(
        isMultiple(newObjectValue, multiple)
          ? (newObjectValue.map((objVal) => objVal.id) as AutocompleteValue<
              number,
              Multiple,
              DisableClearable
            >)
          : (newObjectValue.id as AutocompleteValue<
              number,
              Multiple,
              DisableClearable
            >)
      );
    } else {
      setObjectValue(undefined);
      onChange(undefined);
    }
  };

  return (
    <Autocomplete
      value={objectValue ?? null}
      onChange={updateValue}
      options={options}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth={fullWidth}
      onInputChange={updateOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          helperText={isError ? errors.join(', ') : helperText}
          error={isError}
          margin="normal"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      getOptionLabel={(option) => option[labelPropName]?.toString()}
      renderOption={(props, option) => {
        return (
          <FlexRow component="li" {...props}>
            {imagePropName !== undefined && (
              <Avatar
                title={option[labelPropName]?.toString()}
                url={option[imagePropName]?.toString()}
                size="s"
                sx={{ mr: 1 }}
              />
            )}
            {option[labelPropName]?.toString()}
          </FlexRow>
        );
      }}
      openText={t('form.autocomplete.open')}
      clearText={t('form.autocomplete.clear')}
      noOptionsText={t('form.autocomplete.noOptions')}
      {...props}
    />
  );
}

/**
 * Use 'as' here because memo does not pass the generic type 'T' to the memoized
 * component by default.
 * Remember: never use 'as' in general.
 */
export const AutocompleteSearchField = memo(
  AutocompleteSearchFieldComponent
) as typeof AutocompleteSearchFieldComponent;
