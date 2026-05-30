import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import {
  ControlProps,
  isDescriptionHidden,
  isIntegerControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { useFocus } from '@jsonforms/material-renderers/src/util';
import { withJsonFormsControlProps } from '@jsonforms/react';
import AddIcon from '@mui/icons-material/Add';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import RemoveIcon from '@mui/icons-material/Remove';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import merge from 'lodash/merge';

export const SpinnerControl = (props: ControlProps) => {
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
          size={'medium'}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={!isValid}
          variant="outlined"
          onFocus={onFocus}
          onBlur={onBlur}
          sx={{
            '& .MuiButton-root': {
              borderColor: 'divider',
              minWidth: 0,
              bgcolor: 'action.hover',
              '&:not(.Mui-disabled)': {
                color: 'text.primary',
              },
            },
          }}
        >
          {props.children}
        </FormControl>
      )}
    >
      <BaseNumberField.ScrubArea
        render={
          <Box
            component="span"
            sx={{ userSelect: 'none', width: 'max-content' }}
          />
        }
      >
        <FormLabel
          htmlFor={id}
          sx={{
            display: 'inline-block',
            cursor: 'ew-resize',
            fontSize: '0.875rem',
            color: 'text.primary',
            fontWeight: 500,
            lineHeight: 1.5,
            mb: 0.5,
          }}
        >
          {label}
        </FormLabel>
        <BaseNumberField.ScrubAreaCursor>
          <OpenInFullIcon
            fontSize="small"
            sx={{ transform: 'translateY(12.5%) rotate(45deg)' }}
          />
        </BaseNumberField.ScrubAreaCursor>
      </BaseNumberField.ScrubArea>
      <Box sx={{ display: 'flex' }}>
        <BaseNumberField.Decrement
          render={
            <Button
              variant="outlined"
              aria-label="Decrease"
              size={'medium'}
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: '0px',
                '&.Mui-disabled': {
                  borderRight: '0px',
                },
              }}
            />
          }
        >
          <RemoveIcon fontSize={'medium'} />
        </BaseNumberField.Decrement>

        <BaseNumberField.Input
          id={id}
          render={(props, state) => (
            <OutlinedInput
              required={required}
              inputRef={props.ref}
              value={state.inputValue}
              onBlur={props.onBlur}
              onChange={props.onChange}
              onKeyUp={props.onKeyUp}
              onKeyDown={props.onKeyDown}
              onFocus={props.onFocus}
              slotProps={{
                input: {
                  ...props,
                  size: state.inputValue.length + 1,
                  sx: {
                    textAlign: 'center',
                  },
                },
              }}
              sx={{ pr: 0, borderRadius: 0, flex: 1 }}
            />
          )}
        />

        <BaseNumberField.Increment
          render={
            <Button
              variant="outlined"
              aria-label="Increase"
              size={'medium'}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: '0px',
                '&.Mui-disabled': {
                  borderLeft: '0px',
                },
              }}
            />
          }
        >
          <AddIcon fontSize={'medium'} />
        </BaseNumberField.Increment>
      </Box>
      <FormHelperText error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
    </BaseNumberField.Root>
  );
};

export const spinnerControlTester: RankedTester = rankWith(
  100,
  isIntegerControl,
);
export default withJsonFormsControlProps(SpinnerControl);
