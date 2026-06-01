import { FC, useCallback, useMemo, useRef } from 'react';

import {
  DragDropEventHandlers,
  DragDropProvider,
  DragOverlay,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from '@mui/material';
import { UUID } from 'crypto';
import { clone } from 'lodash';

import { FormPreview } from '#modules/form/components/FormPreview';
import {
  DropLayoutPlaceHolder,
  LayoutInput,
  layoutTypes,
} from '#modules/form/components/formElements/BaseLayout';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';
import { isDescendantOf } from '#modules/form/state/JsonFormReducer';
import { ContainerNode } from '#modules/form/types/form.type';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';

export function SelectBaseComponent() {
  const { jsonForm, updateNode, moveNode, setJsonForm, lang, setLang } =
    useJsonForm();

  const layout = useMemo(
    () =>
      layoutTypes.find((c) => c.title === jsonForm.nodes[jsonForm.rootId].type),
    [jsonForm.nodes, jsonForm.rootId],
  );

  const setLayout = useCallback(
    (val: string) => {
      const input = layoutTypes.find((c) => c.title === val);
      if (!input) return;
      updateNode(jsonForm.rootId, clone(input.defaultUiSchema));
    },
    [jsonForm.rootId, updateNode],
  );

  const id = jsonForm.rootId + '/select_type';
  const label = 'Select the type';
  const snapshot = useRef(structuredClone(jsonForm));

  return (
    <>
      <FlexRow gap={2}>
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
              .filter((type) =>
                [
                  'Categorization',
                  'Group',
                  'HorizontalLayout',
                  'VerticalLayout',
                ].includes(type.title),
              )
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
        <LanguageSelector
          selectedLang={lang}
          setSelectedLang={setLang}
          sx={{ justifySelf: 'center', alignSelf: 'center' }}
        />
      </FlexRow>
      <DragDropProvider
        onDragStart={useCallback<DragDropEventHandlers['onDragStart']>(() => {
          snapshot.current = structuredClone(jsonForm);
        }, [jsonForm])}
        onDragOver={(event) => {
          const { source, target } = event.operation;
          if (
            event.operation.canceled ||
            !target ||
            !isSortable(source) ||
            source.id === target.id
          )
            return;

          if (isSortable(target) && target.group !== source.id) {
            // target is a layout or a tab
            if (
              isDescendantOf(
                jsonForm.nodes,
                target.group as UUID,
                source.id as UUID,
              ) ||
              target.group === source.id
            ) {
              console.warn(
                'Invalid move: cannot move a node into itself or its descendants',
              );
              return;
            }
            moveNode(source.id as UUID, target.group as UUID, target.index);
          } else if (target.type === 'placeholder') {
            // get the actual id
            const targetId = (target.id as string).substring('drop-'.length);
            if (
              isDescendantOf(
                jsonForm.nodes,
                targetId as UUID,
                source.id as UUID,
              ) ||
              targetId === source.id
            ) {
              console.warn(
                'Invalid move: cannot move a node into itself or its descendants',
              );
              return;
            }
            moveNode(source.id as UUID, targetId as UUID);
          }
        }}
        onDragEnd={useCallback<DragDropEventHandlers['onDragEnd']>(
          (event) => {
            if (event.canceled) {
              setJsonForm(snapshot.current);
              return;
            }
          },
          [setJsonForm],
        )}
      >
        {layout?.element && (
          <LayoutInput
            nodeId={jsonForm.rootId}
            allowedLayoutTypes={layout.allowedChildren}
            ContainerElement={layout.element}
          />
        )}
        {
          <DragOverlay>
            {(source) =>
              source.type === 'layout' ? (
                <OverlayLayout nodeId={source.id as UUID} />
              ) : (
                source.id
              )
            }
          </DragOverlay>
        }
      </DragDropProvider>
    </>
  );
}

function OverlayLayout({ nodeId }: { nodeId: UUID }) {
  const theme = useTheme();
  const { jsonForm } = useJsonForm();

  const layout = useMemo(
    () => layoutTypes.find((c) => c.title === jsonForm.nodes[nodeId].type),
    [jsonForm.nodes, nodeId],
  );
  return (
    <FlexRow
      className={'layout-element'}
      alignItems="center"
      width={'100%'}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        transition: 'all 0.15s ease',
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
      p={1}
      gap={1}
    >
      {
        <IconButton>
          <DragIndicatorIcon />
        </IconButton>
      }
      <Box width={'100%'}>
        {layout?.element && (
          <OverlayInput
            allowedLayoutTypes={layout.allowedChildren}
            nodeId={nodeId}
            ContainerElement={layout.element}
          />
        )}
      </Box>
      {
        <FlexCol gap={1}>
          <IconButton aria-label="move up" size="small">
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton aria-label={'remove element'} size={'small'}>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="move down" size="small">
            <ArrowDownwardIcon />
          </IconButton>
        </FlexCol>
      }
    </FlexRow>
  );
}

const OverlayInput = ({
  allowedLayoutTypes,
  nodeId,
  ContainerElement,
}: {
  allowedLayoutTypes: string[];
  nodeId: UUID;
  ContainerElement: FC<BoxProps & { nodeId: UUID }>;
}) => {
  const { jsonForm } = useJsonForm();

  const parentElements = (jsonForm.nodes[nodeId] as ContainerNode).elements;
  const isEmpty = !parentElements || parentElements.length === 0;

  return (
    <ContainerElement nodeId={nodeId} m={1} gap={1}>
      {parentElements?.map((childId: UUID) => (
        <OverlayLayout key={childId} nodeId={childId} />
      ))}
      {isEmpty && <DropLayoutPlaceHolder parentId={nodeId} />}
      {allowedLayoutTypes && (
        <>
          <Button
            variant={'contained'}
            color={'primary'}
            startIcon={<AddIcon />}
            sx={{ justifySelf: 'center', alignSelf: 'center' }}
          >
            Ajouter un élement
          </Button>
        </>
      )}
    </ContainerElement>
  );
};
