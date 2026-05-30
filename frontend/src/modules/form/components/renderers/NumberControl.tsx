import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import {
  ControlProps,
  isDescriptionHidden,
  isNumberControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { useFocus } from '@jsonforms/material-renderers/src/util';
import { withJsonFormsControlProps } from '@jsonforms/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import merge from 'lodash/merge';

export const NumberControl = (props: ControlProps) => {
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    required,
    config,
  } = props;
  const [focused, onFocus, onBlur] = useFocus();
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription,
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
      ? errors
      : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  return (
    <BaseNumberField.Root
      render={(props, state) => (
        <FormControl
          fullWidth={!appliedUiSchemaOptions.trim}
          onFocus={onFocus}
          onBlur={onBlur}
          size={'medium'}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={!isValid}
          variant="outlined"
        >
          {props.children}
        </FormControl>
      )}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(props, state) => (
          <OutlinedInput
            required={required}
            label={label}
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            slotProps={{
              input: props,
            }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  flexDirection: 'column',
                  maxHeight: 'unset',
                  alignSelf: 'stretch',
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                  ml: 0,
                  '& button': {
                    py: 0,
                    flex: 1,
                    borderRadius: 0.5,
                  },
                }}
              >
                <BaseNumberField.Increment
                  render={<IconButton size={'medium'} aria-label="Increase" />}
                >
                  <KeyboardArrowUpIcon
                    fontSize={'medium'}
                    sx={{ transform: 'translateY(2px)' }}
                  />
                </BaseNumberField.Increment>

                <BaseNumberField.Decrement
                  render={<IconButton size={'medium'} aria-label="Decrease" />}
                >
                  <KeyboardArrowDownIcon
                    fontSize={'medium'}
                    sx={{ transform: 'translateY(-2px)' }}
                  />
                </BaseNumberField.Decrement>
              </InputAdornment>
            }
            sx={{ pr: 0 }}
          />
        )}
      />
      <FormHelperText error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
    </BaseNumberField.Root>
  );
};

export const numberControlTester: RankedTester = rankWith(100, isNumberControl);
export default withJsonFormsControlProps(NumberControl);
