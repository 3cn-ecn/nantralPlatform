import {
  ElementType,
  memo,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteProps,
  AutocompleteValue as MuiAutocompleteValue,
  ChipTypeMap,
  CircularProgress,
  TextField,
} from '@mui/material';
import { debounce, isNil, uniqBy } from 'lodash-es';

import { useTranslation } from '#shared/i18n/useTranslation';

import { Avatar } from '../Avatar/Avatar';
import { FlexRow } from '../FlexBox/FlexBox';

// just a function to make typescript work
function isMultiple<T, Multiple extends boolean>(
  objectValue: T | T[] | null,
  multiple?: Multiple,
): objectValue is T[] {
  return !!multiple;
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

type SearchFieldItem<
  ValuePropName extends PropertyKey,
  LabelPropName extends PropertyKey,
  ImagePropName extends PropertyKey = never,
> = Record<ValuePropName, unknown> &
  Record<LabelPropName, string> &
  Partial<Record<ImagePropName, string>>;

// the type of the props for our Autocomplete component
// Omit<.., ...> duplicate the type from MUI and remove some properties
// and then we add our custom properties
type AutocompleteSearchFieldProps<
  T,
  ValuePropName extends keyof T,
  LabelPropName extends keyof T,
  ImagePropName extends keyof T = never,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  ChipComponent extends ElementType = ChipTypeMap['defaultComponent'],
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
  value: AutocompleteValue<T[ValuePropName], Multiple, DisableClearable>;
  handleChange: (
    value: AutocompleteValue<T[ValuePropName], Multiple, DisableClearable>,
    objectValue: AutocompleteValue<T, Multiple, DisableClearable>,
  ) => void;
  defaultObjectValue?: DisableClearable extends true
    ? AutocompleteValue<T, Multiple, DisableClearable>
    : AutocompleteValue<T, Multiple, DisableClearable> | undefined;
  initialObjectValue?: AutocompleteValue<T, Multiple, DisableClearable>;
  fetchInitialOptions?: () => Promise<T[]>;
  fetchOptions: (inputValue: string) => Promise<T[]>;
  name?: string;
  label: string;
  helperText?: string;
  required?: boolean;
  errors?: string[];
  valuePropName: ValuePropName;
  labelPropName: LabelPropName;
  imagePropName?: ImagePropName;
  loading?: boolean;
  margin?: 'normal' | 'none' | 'dense';
};

/**
 * A custom Autocomplete field for searching elements like Group or User on
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
 * @param labelPropName - The name of the label prop in the element
 * @param imagePropName - The name of the image prop in the element
 * @param valuePropName - The name of the label prop in the element
 */
function AutocompleteSearchFieldComponent<
  ValuePropName extends string,
  LabelPropName extends string,
  ImagePropName extends string = never,
  T extends SearchFieldItem<ValuePropName, LabelPropName, ImagePropName> =
    SearchFieldItem<ValuePropName, LabelPropName, ImagePropName>,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>({
  value,
  handleChange,
  multiple,
  defaultObjectValue = (multiple ? [] : null) as AutocompleteValue<
    T,
    Multiple,
    DisableClearable
  >,
  fetchInitialOptions,
  fetchOptions,
  initialObjectValue,
  name,
  label,
  helperText,
  required = false,
  errors,
  fullWidth = true,
  valuePropName,
  labelPropName,
  imagePropName,
  loading = false,
  margin = 'normal',
  ...props
}: AutocompleteSearchFieldProps<
  T,
  ValuePropName,
  LabelPropName,
  ImagePropName,
  Multiple,
  DisableClearable,
  ChipComponent
>) {
  const { t } = useTranslation();

  const [options, setOptions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  const [objectValue, setObjectValue] = useState<
    AutocompleteValue<T, Multiple, DisableClearable>
  >(
    initialObjectValue ??
      (defaultObjectValue as AutocompleteValue<T, Multiple, DisableClearable>),
  );
  const hasAppliedDefaultObjectValue = useRef(false);

  const isError = errors !== undefined;

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    // only apply default once
    if (hasAppliedDefaultObjectValue.current) return;

    if (
      (isMultiple(objectValue, multiple) && !objectValue.length) ||
      (!isMultiple(objectValue, multiple) && isNil(objectValue))
    ) {
      setObjectValue(
        defaultObjectValue as AutocompleteValue<T, Multiple, DisableClearable>,
      );
      hasAppliedDefaultObjectValue.current = true;
    }
  }, [defaultObjectValue, objectValue, multiple]);

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
          setOptions(
            isMultiple(objectValue, multiple)
              ? uniqBy(data.concat(...objectValue), (obj) => obj[valuePropName])
              : data,
          );
          setIsLoading(false);
        })
        .catch((err) => console.error(err));
    },
    300,
  );

  const updateValue = (
    event: SyntheticEvent,
    newObjectValue: AutocompleteValue<T, Multiple, DisableClearable>,
  ) => {
    setObjectValue(newObjectValue);
    handleChange(
      isMultiple(newObjectValue, multiple)
        ? (newObjectValue.map(
            (objVal) => objVal[valuePropName],
          ) as AutocompleteValue<T[ValuePropName], Multiple, DisableClearable>)
        : (newObjectValue?.[valuePropName] as AutocompleteValue<
            T[ValuePropName],
            Multiple,
            DisableClearable
          >),
      newObjectValue,
    );
  };

  return (
    <Autocomplete
      value={objectValue}
      onChange={updateValue}
      options={options}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) =>
        option[valuePropName] === value[valuePropName]
      }
      fullWidth={fullWidth}
      onInputChange={updateOptions}
      multiple={multiple}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          helperText={isError ? errors.join(', ') : helperText}
          error={isError}
          margin={margin}
          InputProps={{
            ...params.InputProps,
            startAdornment: isMultiple(objectValue, multiple)
              ? params.InputProps.startAdornment
              : !!imagePropName &&
                !!objectValue && (
                  <Avatar
                    alt={objectValue[labelPropName]}
                    src={objectValue[imagePropName]}
                    size="s"
                  />
                ),
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
            {!!imagePropName && (
              <Avatar
                alt={option[labelPropName] as string}
                src={option[imagePropName] as string | undefined}
                size="s"
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
  AutocompleteSearchFieldComponent,
) as typeof AutocompleteSearchFieldComponent;
