import { SyntheticEvent, useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteProps,
  AutocompleteValue,
  CircularProgress,
  TextField,
} from '@mui/material';
import { debounce, isNil } from 'lodash-es';

import { Geocode } from '#modules/map/geocode.type';
import { useTranslation } from '#shared/i18n/useTranslation';

import { FlexRow } from '../FlexBox/FlexBox';

type AutocompleteAddressFieldProps<
  LabelPropName extends string,
  DisableClearable extends boolean,
> = Omit<
  AutocompleteProps<Geocode, false, DisableClearable, false>,
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
  value: AutocompleteValue<string, false, DisableClearable, false>;
  loading?: boolean;
  handleChange: (
    value: AutocompleteValue<string, false, DisableClearable, false>,
    objectValue: AutocompleteValue<Geocode, false, DisableClearable, false>,
  ) => void;
  initialObjectValue?: AutocompleteValue<
    Geocode,
    false,
    DisableClearable,
    false
  >;
  defaultObjectValue?: DisableClearable extends true
    ? AutocompleteValue<Geocode, false, DisableClearable, false>
    : AutocompleteValue<Geocode, false, DisableClearable, false> | undefined;
  errors?: string[];
  fetchInitialOptions?: () => Promise<Geocode[]>;
  fetchOptions: (inputValue: string) => Promise<Geocode[]>;
  name?: string;
  label: string;
  helperText?: string;
  required?: boolean;
  labelPropName: LabelPropName;
};

export function AutocompleteAddressField<
  LabelPropName extends string &
    {
      [LabelPropName in keyof Geocode]: Geocode[LabelPropName] extends string
        ? LabelPropName
        : never;
    }[keyof Geocode],
  DisableClearable extends boolean = false,
>({
  value,
  loading,
  initialObjectValue,
  defaultObjectValue,
  errors,
  fetchInitialOptions,
  handleChange,
  fetchOptions,
  fullWidth = true,
  name,
  label,
  required,
  helperText,
  labelPropName,
  ...props
}: AutocompleteAddressFieldProps<LabelPropName, DisableClearable>) {
  const { t } = useTranslation();

  const [options, setOptions] = useState<Geocode[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  const [objectValue, setObjectValue] = useState<
    AutocompleteValue<Geocode, false, DisableClearable, false>
  >(
    initialObjectValue ??
      (defaultObjectValue as AutocompleteValue<
        Geocode,
        false,
        DisableClearable,
        false
      >),
  );

  const isError = errors !== undefined;

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

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
      reason: AutocompleteInputChangeReason,
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
    300,
  );

  const updateValue = (
    event: SyntheticEvent,
    newObjectValue: AutocompleteValue<Geocode, false, DisableClearable, false>,
  ) => {
    setObjectValue(newObjectValue);
    handleChange(
      newObjectValue?.address as AutocompleteValue<
        string,
        false,
        DisableClearable,
        false
      >,
      newObjectValue,
    );
  };

  return (
    <Autocomplete
      value={objectValue}
      onChange={updateValue}
      options={options}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.address === value.address}
      fullWidth={fullWidth}
      onInputChange={updateOptions}
      multiple={false}
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
      getOptionLabel={(option) => option[labelPropName]?.toString() || ''}
      renderOption={(props, option) => {
        return (
          <FlexRow component="li" gap={1} {...props}>
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
