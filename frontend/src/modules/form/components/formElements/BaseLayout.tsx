import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { pointerIntersection } from '@dnd-kit/collision';
import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  DragIndicator as DragIndicatorIcon,
  HighlightAlt as DropIcon,
} from '@mui/icons-material';
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { UUID } from 'crypto';
import { clone } from 'lodash';

import { BaseQuestion } from '#modules/form/components/formElements/BaseQuestion';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';
import {
  CategoryNode,
  ContainerNode,
  GroupNode,
  LabelNode,
} from '#modules/form/types/form.type';
import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { RichTextField, TextField } from '#shared/components/FormFields';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { TextModal } from '#shared/components/Modal/TextModal';
import { TranslatedFieldObject } from '#shared/infra/translatedFields/translatedField.types';

interface Layout {
  title: string;
  element: FC<{ children: ReactNode; nodeId: UUID }>;
  allowedChildren: string[];
  defaultUiSchema: {
    elements?: UUID[];
    type: string;
    label?: TranslatedFieldObject;
    inputType?: string;
    options?: UISchemaElement['options'];
    scope?: string;
    text?: TranslatedFieldObject;
    schema?: JsonSchema;
  };
}

const DepthContext = createContext(0);

// =========================
// LAYOUT INPUT COMPONENT
// =========================

export const LayoutInput = ({
  allowedLayoutTypes,
  nodeId,
  ContainerElement,
}: {
  allowedLayoutTypes: string[];
  nodeId: UUID;
  ContainerElement: FC<BoxProps & { nodeId: UUID }>;
}) => {
  const { jsonForm, addNode, moveNode } = useJsonForm();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const depth = useContext(DepthContext);

  // const { ref } = useDroppable({
  //   id: 'drop-' + nodeId,
  //   type: 'container',
  //   accept: 'layout',
  // });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddChild = useCallback(
    (child: {
      elements?: UUID[];
      type: string;
      label?: TranslatedFieldObject;
      inputType?: string;
      options?: UISchemaElement['options'];
      scope?: string;
      text?: TranslatedFieldObject;
      schema?: JsonSchema;
    }) => {
      addNode(nodeId, child);
    },
    [addNode, nodeId],
  );

  const handleMoveSibling = useCallback(
    (childId: UUID, direction: 'up' | 'down') => {
      const parent = jsonForm.nodes[nodeId];
      if (!parent || !('elements' in parent)) return;
      const siblings = parent.elements;
      const idx = siblings.indexOf(childId);
      if (idx === -1) return;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= siblings.length) return;
      moveNode(childId, nodeId, newIdx);
    },
    [jsonForm.nodes, nodeId, moveNode],
  );

  const parentElements = (jsonForm.nodes[nodeId] as ContainerNode).elements;
  const isEmpty = !parentElements || parentElements.length === 0;

  return (
    <DepthContext.Provider value={depth + 1}>
      <ContainerElement
        // ref={ref}
        nodeId={nodeId}
        m={1}
        gap={1}
        // sx={
        //   isEmpty
        //     ? {
        //         minHeight: '120px',
        //         border: `2px dashed ${theme.palette.divider}`,
        //         borderRadius: `${theme.shape.borderRadius}px`,
        //         backgroundColor: theme.palette.action.hover,
        //         display: 'flex',
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //       }
        //     : undefined
        // }
      >
        {parentElements?.map((childId: UUID, i: number) => (
          <BaseLayout
            key={childId}
            nodeId={childId}
            parentId={nodeId}
            handleMoveSibling={handleMoveSibling}
            first={i === 0}
            index={i}
            last={i === parentElements.length - 1}
          />
        ))}
        {isEmpty && <DropLayoutPlaceHolder parentId={nodeId} />}
        {allowedLayoutTypes && (
          <>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={handleClick}
              aria-label="add"
              id={`add-button-${nodeId}`}
              aria-controls={open ? `add-menu-${nodeId}` : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              startIcon={<AddIcon />}
              sx={{ justifySelf: 'center', alignSelf: 'center' }}
            >
              Ajouter un élement
            </Button>
            <Menu
              id={`add-menu-${nodeId}`}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': `add-button-${nodeId}`,
                },
              }}
            >
              {allowedLayoutTypes.map((type) => (
                <MenuItem
                  key={type}
                  onClick={() => {
                    const input = layoutTypes.find((c) => c.title === type);
                    if (input) {
                      handleAddChild(clone(input.defaultUiSchema));
                    }
                    handleClose();
                  }}
                >
                  {type}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </ContainerElement>
    </DepthContext.Provider>
  );
};

// =========================
// GROUP LAYOUT COMPONENT
// =========================

const GroupLayoutInput = ({
  children,
  nodeId,
  ...props
}: {
  nodeId: UUID;
  children: ReactNode;
} & BoxProps) => {
  const { jsonForm, updateNode, lang } = useJsonForm();

  const label = useMemo(
    () => (jsonForm.nodes[nodeId] as GroupNode).label,
    [jsonForm.nodes, nodeId],
  );

  const setLabel = useCallback(
    (val: string) => updateNode(nodeId, { label: { ...label, [lang]: val } }),
    [label, nodeId, lang, updateNode],
  );

  return (
    <Card>
      <CardContent>
        <TextField
          handleChange={(val) => setLabel(val)}
          value={label[lang]}
          label={'Label'}
          helperText={'Nom du groupe de questions'}
        />
        <FlexCol {...props}>{children}</FlexCol>
      </CardContent>
    </Card>
  );
};

// =========================
// LABEL LAYOUT COMPONENT
// =========================

const LabelLayout = ({ nodeId }: { nodeId: UUID }) => {
  const { jsonForm, updateNode, lang } = useJsonForm();

  const text = useMemo(
    () => (jsonForm.nodes[nodeId] as LabelNode).text,
    [jsonForm.nodes, nodeId],
  );

  const setText = useCallback(
    (val: string) => updateNode(nodeId, { text: { ...text, [lang]: val } }),
    [nodeId, lang, text, updateNode],
  );

  return (
    <RichTextField
      handleChange={(val) => setText(val)}
      value={text[lang]}
      label={'Texte'}
      helperText={'Paragraphe intégré au questionnaire'}
    />
  );
};

// =========================
// CATEGORY TAB LABEL COMPONENT
// =========================

const CategoryTabLabel = ({
  nodeId,
  handleMoveTab,
}: {
  nodeId: UUID;
  handleMoveTab: (nodeId: UUID, direction: 'left' | 'right') => void;
}) => {
  const { jsonForm, removeNode, updateNode, lang } = useJsonForm();
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const label = useMemo(
    () => (jsonForm.nodes[nodeId] as CategoryNode).label,
    [jsonForm.nodes, nodeId],
  );

  const setLabel = useCallback(
    (val: string) => updateNode(nodeId, { label: { ...label, [lang]: val } }),
    [label, nodeId, lang, updateNode],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <IconButton
        size="small"
        aria-label={`Move left ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          handleMoveTab(nodeId, 'left');
        }}
      >
        <ArrowBackIosIcon fontSize="inherit" />
      </IconButton>
      {label[lang] || '>EMPTY<'}
      <IconButton
        size="small"
        aria-label={`Rename ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenRenameModal(true);
        }}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
      <IconButton
        size="small"
        aria-label={`Move right ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          handleMoveTab(nodeId, 'right');
        }}
      >
        <ArrowForwardIosIcon fontSize="inherit" />
      </IconButton>
      <IconButton
        size="small"
        aria-label={'Remove this element'}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDeleteModal(true);
        }}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
      {openRenameModal && (
        <TextModal
          title={`Rename ${label[lang] || 'tab'}`}
          body={'Please enter the new name for this part'}
          oldValue={label[lang]}
          onCancel={() => setOpenRenameModal(false)}
          onConfirm={(newLabel) => {
            setOpenRenameModal(false);
            setLabel(newLabel);
          }}
        />
      )}
      {openDeleteModal && (
        <ConfirmationModal
          title={`Delete ${label[lang] || 'tab'}`}
          body={
            'Voulez-vous supprimer cette partie ? Cette action est définitive'
          }
          onCancel={() => setOpenDeleteModal(false)}
          onConfirm={() => {
            setOpenDeleteModal(false);
            removeNode(nodeId);
          }}
        />
      )}
    </Box>
  );
};

// =========================
// DRAGGABLE TAB COMPONENT
// =========================

const DraggableCategoryTab = ({
  nodeId,
  parentId,
  index,
  handleMoveTab,
  ...props
}: {
  nodeId: UUID;
  value: UUID;
  parentId: UUID;
  index: number;
  handleMoveTab: (nodeId: UUID, direction: 'left' | 'right') => void;
  selected?: boolean;
}) => {
  const { ref } = useSortable({
    id: nodeId,
    index: index,
    group: parentId,
    type: 'tab',
    accept: 'tab',
  });

  return (
    <Tab
      component={'span'}
      ref={ref}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DragIndicatorIcon fontSize="small" sx={{ cursor: 'grab' }} />
          <CategoryTabLabel nodeId={nodeId} handleMoveTab={handleMoveTab} />
        </Box>
      }
      {...props}
    />
  );
};

// =========================
// CATEGORIZATION LAYOUT COMPONENT
// =========================

const CategorizationLayoutInput = ({ nodeId }: { nodeId: UUID }) => {
  const { jsonForm, addNode, moveNode } = useJsonForm();
  const [activeTab, setActiveTab] = useState<UUID | undefined>(undefined);
  const [openAddModal, setOpenAddModal] = useState(false);
  const { ref } = useDroppable({ id: nodeId, type: 'tabs', accept: 'tab' });

  const node = useMemo(() => jsonForm.nodes[nodeId], [jsonForm.nodes, nodeId]);

  const handleAddChild = useCallback(
    (label: string) =>
      addNode(nodeId, {
        type: 'Category',
        elements: [],
        label: { fr: label, en: label },
      }),
    [addNode, nodeId],
  );

  const handleMoveTab = useCallback(
    (tabId: UUID, direction: 'left' | 'right') => {
      const node = jsonForm.nodes[nodeId];
      if (!node || !('elements' in node)) return;
      const tabs = node.elements;
      const idx = tabs.indexOf(tabId);
      if (idx === -1) return;
      const newIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= tabs.length) return;
      moveNode(tabId, nodeId, newIdx);
    },
    [jsonForm.nodes, nodeId, moveNode],
  );

  if (node.type !== 'Categorization') {
    return null;
  }

  return (
    <FlexCol>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Tabs
          ref={ref}
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {node.elements.map((childId, i) => (
            <DraggableCategoryTab
              key={childId}
              nodeId={childId}
              parentId={nodeId}
              index={i}
              handleMoveTab={handleMoveTab}
              value={childId}
            />
          ))}
        </Tabs>
        <Button startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Add Tab
        </Button>
        {openAddModal && (
          <TextModal
            title={'Nouvelle partie'}
            body={'Donnez un nom à cette nouvelle partie'}
            onCancel={() => setOpenAddModal(false)}
            onConfirm={(label) => {
              setOpenAddModal(false);
              handleAddChild(label);
            }}
          />
        )}
      </Box>
      {activeTab && (
        <LayoutInput
          allowedLayoutTypes={[
            'Control',
            'Categorization',
            'HorizontalLayout',
            'Group',
            'Label',
          ]}
          nodeId={activeTab}
          ContainerElement={FlexCol}
        />
      )}
    </FlexCol>
  );
};

// =========================
// LAYOUT TYPES  (CONSTANT)
// =========================

export const layoutTypes: Layout[] = [
  {
    title: 'Categorization',
    element: CategorizationLayoutInput,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultUiSchema: {
      type: 'Categorization',
      elements: [],
      options: {
        showNavButton: true,
      },
    },
  },
  {
    title: 'VerticalLayout',
    element: FlexCol,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultUiSchema: { type: 'VerticalLayout', elements: [] },
  },
  {
    title: 'HorizontalLayout',
    element: FlexAuto,
    allowedChildren: [
      'Control',
      'Categorization',
      'VerticalLayout',
      'Group',
      'Label',
    ],
    defaultUiSchema: { type: 'HorizontalLayout', elements: [] },
  },
  {
    title: 'Group',
    element: GroupLayoutInput,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultUiSchema: {
      type: 'Group',
      elements: [],
      label: { fr: '', en: '' },
    },
  },
  {
    title: 'Control',
    element: BaseQuestion,
    allowedChildren: [],
    defaultUiSchema: { type: 'Control', scope: '' },
  },
  {
    title: 'Label',
    element: LabelLayout,
    allowedChildren: [],
    defaultUiSchema: {
      type: 'Label',
      text: { fr: '', en: '' },
    },
  },
];

// =========================
// BASE LAYOUT COMPONENT
// =========================

interface BaseLayoutProps {
  nodeId?: UUID;
  handleMoveSibling?: (childId: UUID, direction: 'up' | 'down') => void;
  first?: boolean;
  index: number;
  parentId?: UUID;
  last?: boolean;
  overlay?: boolean;
}

export function DropLayoutPlaceHolder({ parentId }: { parentId: UUID }) {
  // const { ref } = useSortable({
  //   id: `placeholder-${parentId}`,
  //   index: 0,
  //   type: 'placeholder',
  //   accept: 'layout',
  //   group: parentId,
  // });
  const { ref } = useDroppable({
    id: 'drop-' + parentId,
    type: 'placeholder',
    accept: 'layout',
    collisionDetector: pointerIntersection,
  });
  const theme = useTheme();
  return (
    <FlexCol
      border={`3px dashed ${theme.palette.divider}`}
      borderRadius={`${theme.shape.borderRadius}px`}
      sx={{
        backgroundColor: theme.palette.action.hover,
      }}
      ref={ref}
      minHeight={200}
      minWidth={100}
      width="100%"
      gap={2}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <DropIcon />
      <Typography variant="subtitle1" textAlign="center" maxWidth={300}>
        Déplacez un élément ici ou cliquez ci-dessous pour en ajouter un
      </Typography>
    </FlexCol>
  );
}

export function BaseLayout({
  nodeId,
  handleMoveSibling,
  first,
  index,
  last,
  parentId,
}: BaseLayoutProps) {
  const { jsonForm, removeNode } = useJsonForm();
  const theme = useTheme();
  const depth = useContext(DepthContext);

  const actualNodeId = nodeId ?? jsonForm.rootId;

  const layout = useMemo(
    () =>
      layoutTypes.find((c) => c.title === jsonForm.nodes[actualNodeId].type),
    [jsonForm.nodes, actualNodeId],
  );
  const { ref, isDragging, handleRef } = useSortable({
    id: actualNodeId,
    index,
    type: 'layout',
    accept: 'layout',
    group: parentId,
    //collisionDetector: pointerIntersection,
    //collisionPriority: depth,
  });
  /*const { ref, isDragging } = useDraggable({
    id: actualNodeId,
    type: 'layout',
  });*/
  return (
    <FlexRow
      className={'layout-element'}
      ref={ref}
      alignItems="center"
      data-dragging={isDragging}
      width={'100%'}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        transition: 'all 0.15s ease',
        borderRadius: `${theme.shape.borderRadius}px`,
        '&:hover:not(:has(.layout-element:hover))': {
          backgroundColor: theme.palette.action.hover,
        },
        opacity: isDragging ? '50%' : undefined,
      }}
      p={1}
      gap={1}
    >
      {handleMoveSibling && (
        <IconButton ref={handleRef}>
          <DragIndicatorIcon />
        </IconButton>
      )}
      <DepthContext.Provider value={depth + 1}>
        <Box width={'100%'}>
          {layout?.element && (
            <LayoutInput
              allowedLayoutTypes={layout.allowedChildren}
              nodeId={actualNodeId}
              ContainerElement={layout.element}
            />
          )}
        </Box>
      </DepthContext.Provider>
      {handleMoveSibling && (
        <FlexCol gap={1}>
          <IconButton
            aria-label="move up"
            size="small"
            onClick={() => handleMoveSibling(actualNodeId, 'up')}
            disabled={first}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton
            aria-label={'remove element'}
            size={'small'}
            onClick={() => removeNode(actualNodeId)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="move down"
            size="small"
            onClick={() => handleMoveSibling(actualNodeId, 'down')}
            disabled={last}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </FlexCol>
      )}
    </FlexRow>
  );
}
