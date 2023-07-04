import { memo, useRef } from 'react';

import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  SvgIconComponent,
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
  name: string;
  value: File | null;
  onChange: (value: File | null) => void;
  errors?: string[];
  prevFileName?: string;
  accept?: string;
};

function FileFieldComponent({
  name,
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
  const inputElementRef = useRef<HTMLInputElement>();
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
        startAdornment: (
          <InputAdornment position="start">
            <Button
              component="label"
              htmlFor={name}
              onKeyDownCapture={(e) => {
                if (e.code === 'Space' || e.code === 'Enter') {
                  inputElementRef.current.click();
                }
              }}
              disabled={disabled}
              variant="contained"
              color="secondary"
              size="small"
              sx={{ mr: 1 }}
            >
              {t('form.file.label')}
            </Button>
            <input
              name={name}
              id={name}
              ref={inputElementRef}
              hidden
              disabled={disabled}
              accept={accept}
              type="file"
              onChange={(event) => {
                if (event.target.files.length > 0)
                  onChange(event.target.files[0]);
              }}
            />
          </InputAdornment>
        ),
        endAdornment: (value || prevFileName) && !disabled && (
          <InputAdornment position="start">
            {/* If a new file is selected, the button proposes to remove it */}
            {isRealFile(value) && (
              <FileActionButton
                title={t('form.file.clearButton.label')}
                onClick={() => onChange(null)}
                Icon={ClearIcon}
                key="action-button"
              />
            )}
            {/* If showing the previous file, the button proposes to delete it */}
            {isNotAFile(value) && prevFileName && (
              <FileActionButton
                title={t('form.file.deleteButton.label')}
                onClick={() => onChange(new File([], ''))}
                Icon={DeleteIcon}
                key="action-button"
              />
            )}
            {/* If the user click to delete the file, the button proposes to undo it */}
            {isDeletedFile(value) && (
              <FileActionButton
                title={t('form.file.undoButton.label')}
                onClick={() => onChange(null)}
                Icon={UndoIcon}
                key="action-button"
              />
            )}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

interface FileActionsButtonProps {
  title: string;
  onClick: () => void;
  Icon?: SvgIconComponent;
}

function FileActionButton({ title, onClick, Icon }: FileActionsButtonProps) {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick} edge="end">
        <Icon />
      </IconButton>
    </Tooltip>
  );
}

export const FileField = memo(FileFieldComponent);
