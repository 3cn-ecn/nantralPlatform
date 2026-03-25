import { FC, useCallback, useMemo, useState } from 'react';

import { UISchemaElement } from '@jsonforms/core';
import { Add } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { clone, get } from 'lodash';

import { JsonFormSchema } from '#modules/form/jsonForm.type';
import { BaseQuestion } from '#pages/Form/formElements/BaseQuestion';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';

interface ElementType {
  title: string;
  element: FC<any>;
  defaultUiSchema: UISchemaElement;
}

const LayoutInput: FC<{
  allowedLayoutTypes: string[];
  path: string;
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string | string[], val: any) => void;
}> = ({ allowedLayoutTypes, path, jsonForm, setJsonForm }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const children: UISchemaElement[] = useMemo(
    () => get(jsonForm, `uiSchema${path}.elements`, []),
    [jsonForm, path],
  );
  const setChildren = useCallback(
    (val) => {
      setJsonForm(`uiSchema${path}.elements`, val);
    },
    [path, setJsonForm],
  );
  const [count, setCount] = useState(0);

  const handleRemove = useCallback(
    (val) => {
      setChildren(children.filter((child) => child !== val));
    },
    [children, setChildren],
  );
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAddChild = useCallback(
    (child) => {
      setChildren([...children, child]);
    },
    [children, setChildren],
  );

  return (
    <FlexCol gap={1} my={1}>
      <FlexRow gap={2} justifyContent={'space-between'}>
        <Typography>Children</Typography>
        <IconButton
          onClick={handleClick}
          aria-label="add"
          id={`add-button-${path}`}
          aria-controls={open ? `add-menu-${path}` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
        >
          <Add />
        </IconButton>
        <Menu
          id={`add-menu-${path}`}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': `add-button-${path}`,
            },
          }}
        >
          {allowedLayoutTypes.map((type) => (
            <MenuItem
              key={type}
              onClick={() => {
                const input = layoutTypes.find((c) => c.title === type);
                handleAddChild(clone(input?.defaultUiSchema));
                handleClose();
              }}
            >
              {type}
            </MenuItem>
          ))}
        </Menu>
      </FlexRow>
      {children.map((child, i) => (
        <FlexCol gap={2} p={2} key={i}>
          <BaseLayout
            path={`${path}.elements.${i}`}
            jsonForm={jsonForm}
            setJsonForm={setJsonForm}
            allowedLayoutTypes={allowedLayoutTypes}
          />
          <Button onClick={() => handleRemove(child)}>Remove</Button>
        </FlexCol>
      ))}
    </FlexCol>
  );
};

const GroupLayoutInput: FC<{
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string | string[], val: any) => void;
  path: string;
}> = (props) => {
  const label = useMemo(
    () => get(props.jsonForm, `uiSchema${props.path}.label`, ''),
    [props.jsonForm, props.path],
  );
  const setLabel = useCallback(
    (val) => props.setJsonForm(`uiSchema${props.path}.label`, val),
    [props],
  );
  return (
    <FlexCol gap={2}>
      <TextField
        handleChange={(val) => setLabel(val)}
        value={label}
        label={'Label'}
        helperText={'Nom du groupe de questions'}
      />
      <LayoutInput
        allowedLayoutTypes={[
          'Control',
          'Categorization',
          'HorizontalLayout',
          'VerticalLayout',
          'Group',
        ]}
        {...props}
      />
    </FlexCol>
  );
};

const CategoryLayoutInput: FC<{
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string | string[], val: any) => void;
  path: string;
}> = (props) => {
  const label = useMemo(
    () => get(props.jsonForm, `uiSchema${props.path}.label`, ''),
    [props.jsonForm, props.path],
  );
  const setLabel = useCallback(
    (val) => props.setJsonForm(`uiSchema${props.path}.label`, val),
    [props],
  );
  return (
    <FlexCol gap={2}>
      <TextField
        handleChange={(val) => setLabel(val)}
        value={label}
        label={'Label'}
        helperText={'Nom de la catégorie'}
      />
      <LayoutInput
        allowedLayoutTypes={[
          'Control',
          'Categorization',
          'HorizontalLayout',
          'VerticalLayout',
          'Group',
        ]}
        {...props}
      />
    </FlexCol>
  );
};

const CategorizationLayoutInput: FC<{
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string | string[], val: any) => void;
  path: string;
}> = (props) => (
  <LayoutInput
    allowedLayoutTypes={[
      'Category',
      //'Categorization' // Disabled for now because there is no renderers
    ]}
    {...props}
  />
);

const layoutTypes: ElementType[] = [
  {
    title: 'Categorization',
    element: CategorizationLayoutInput,
    defaultUiSchema: {
      type: 'Categorization',
      elements: [],
      options: {
        variant: 'stepper',
        showNavButton: true,
      },
    },
  },
  {
    title: 'Category',
    element: CategoryLayoutInput,
    defaultUiSchema: { type: 'Category', elements: [] },
  },
  {
    title: 'VerticalLayout',
    element: (props) => (
      <LayoutInput
        allowedLayoutTypes={[
          'Control',
          'Categorization',
          'HorizontalLayout',
          'VerticalLayout',
          'Group',
        ]}
        {...props}
      />
    ),
    defaultUiSchema: { type: 'VerticalLayout', elements: [] },
  },
  {
    title: 'HorizontalLayout',
    element: (props) => (
      <LayoutInput
        allowedLayoutTypes={[
          'Control',
          'Categorization',
          'HorizontalLayout',
          'VerticalLayout',
          'Group',
        ]}
        {...props}
      />
    ),
    defaultUiSchema: { type: 'HorizontalLayout', elements: [] },
  },
  {
    title: 'Group',
    element: GroupLayoutInput,
    defaultUiSchema: { type: 'Group', elements: [] },
  },
  {
    title: 'Control',
    element: BaseQuestion,
    defaultUiSchema: { type: 'Control', scope: '' },
  },
];

interface BaseQuestionProps {
  path: string;
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string | string[], val: any) => void;
  allowedLayoutTypes?: string[];
}

export function BaseLayout({
  path,
  jsonForm,
  setJsonForm,
  allowedLayoutTypes,
}: BaseQuestionProps) {
  if (!allowedLayoutTypes) allowedLayoutTypes = layoutTypes.map((t) => t.title);
  const layout = useMemo(
    () =>
      layoutTypes.find(
        (c) => c.title === get(jsonForm, `uiSchema${path}.type`, ''),
      ),
    [jsonForm, path],
  );
  const setLayout = useCallback(
    (val) => {
      const input = layoutTypes.find((c) => c.title === val);
      if (!input) return;
      //setJsonForm(`schema${path}`, clone(input.defaultSchema));
      //setJsonForm(`schema${path}.x-layout`, input.title);
      setJsonForm(`uiSchema${path}`, clone(input.defaultUiSchema));
      if (input.title === 'Control') {
      }
    },
    [jsonForm, path, setJsonForm],
  );

  const id = path + '/select_type';
  const label = 'Select the type';
  return (
    <>
      <FormControl fullWidth margin={'normal'}>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          variant={'outlined'}
          onChange={(e) => setLayout(e.target.value)}
          label={label}
          labelId={id}
          value={layout?.title ?? ''}
        >
          {layoutTypes
            .filter((type) => allowedLayoutTypes?.includes(type.title))
            .map((child) => (
              <MenuItem key={child.title} value={child.title}>
                {child.title}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>
          Choisissez le type d&#39;élément que vous souhaitez ajouter
        </FormHelperText>
      </FormControl>
      {layout?.element && (
        <layout.element
          jsonForm={jsonForm}
          setJsonForm={setJsonForm}
          path={path}
        />
      )}
    </>
  );
}
