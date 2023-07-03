import { memo } from 'react';

import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Undo as UndoIcon,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

const MEGA_BYTE = 2 ** 20;
const MAX_FILE_SIZE = 4 * MEGA_BYTE;

function isDeletedFile(file?: File) {
  return !!file && !file.name;
}
function isRealFile(file?: File) {
  return !!file?.name;
}
function isNotAFile(file?: File) {
  return !file;
}
function isTooHeavy(file?: File) {
  return !!file && file.size > MAX_FILE_SIZE;
}

type FileFieldProps = Omit<TextFieldProps, 'error' | 'value' | 'onChange'> & {
  value: File | null;
  onChange: (value: File | null) => void;
  errors?: string[];
  prevFileName?: string;
  accept?: string;
};

function FileFieldComponent({
  value,
  errors,
  helperText,
  prevFileName,
  accept,
  onChange,
  disabled,
  fullWidth = true,
  ...props
}: FileFieldProps) {
  const { t, formatNumber } = useTranslation();
  const isError = errors !== undefined;
  const fileName =
    value?.name ||
    prevFileName?.split('/').at(-1) ||
    t('form.file.placeholder');

  function getHelperText() {
    if (isDeletedFile(value)) {
      return t('form.file.delete.warning');
    }
    if (isTooHeavy(value)) {
      return t('form.file.error.tooHeavy', {
        maxSize: formatNumber(MAX_FILE_SIZE / MEGA_BYTE, {
          style: 'unit',
          unit: 'megabyte',
        }),
      });
    }
    if (isError) {
      return errors.join(', ');
    }
    return helperText;
  }

  return (
    <TextField
      fullWidth={fullWidth}
      spellCheck={false}
      contentEditable={false}
      error={isError || isTooHeavy(value)}
      helperText={getHelperText()}
      value={fileName}
      margin="normal"
      disabled={disabled}
      sx={{
        ...props.sx,
        '& input': isDeletedFile(value)
          ? { textDecoration: 'line-through' }
          : {},
      }}
      inputProps={{ disabled: true }}
      InputProps={{
        endAdornment: (value || prevFileName) && !disabled && (
          <InputAdornment position="start">
            {/* If a new file is selected, the button proposes to remove it */}
            {isRealFile(value) && (
              <Tooltip title={t('form.file.clearButton.label')}>
                <IconButton onClick={() => onChange(null)} edge="end">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* If showing the previous file, the button proposes to delete it */}
            {isNotAFile(value) && prevFileName && (
              <Tooltip title={t('form.file.deleteButton.label')}>
                <IconButton
                  onClick={() => onChange(new File([], ''))}
                  edge="end"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* If the user click to delete the file, the button proposes to undo it */}
            {isDeletedFile(value) && (
              <Tooltip title={t('form.file.undoButton.label')}>
                <IconButton onClick={() => onChange(null)} edge="end">
                  <UndoIcon />
                </IconButton>
              </Tooltip>
            )}
          </InputAdornment>
        ),
        startAdornment: (
          <InputAdornment position="start">
            <Button
              disabled={disabled}
              size="small"
              sx={{ mr: 1 }}
              variant="contained"
              component="label"
            >
              {t('form.file.label')}
              <input
                disabled={disabled}
                hidden
                accept={accept}
                value={undefined}
                type="file"
                onChange={(event) => {
                  if (event.target.files.length > 0)
                    onChange(event.target.files[0]);
                }}
              />
            </Button>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

export const FileField = memo(FileFieldComponent);
