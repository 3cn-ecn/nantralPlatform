import { useCallback, useMemo, useState } from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import { UUID } from 'crypto';

import { LAYOUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';

export function AddChildButton({ nodeId }: { nodeId: UUID }) {
  const { form, addNode } = useFormContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const node = useMemo(() => form.nodes[nodeId], [form.nodes, nodeId]);

  const layout = useMemo(
    () => LAYOUT_TYPES[node.payload.type],
    [node.payload.type],
  );

  const handleAddChild = useCallback(
    (type) => {
      const defaultLayout = LAYOUT_TYPES[type];
      if (!defaultLayout) return;
      addNode(nodeId, {
        type: 'Control',
        translation: { fr: {}, en: {} },
        options: {},
        schema: {},
        ...defaultLayout.defaultPayload,
      });
    },
    [addNode, nodeId],
  );

  return (
    <>
      <Button
        variant={'contained'}
        color={'primary'}
        onClick={(event) => setAnchorEl(event.currentTarget)}
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
        onClose={() => setAnchorEl(null)}
        slotProps={{
          list: {
            'aria-labelledby': `add-button-${nodeId}`,
          },
        }}
      >
        {layout?.allowedChildren.map((type) => (
          <MenuItem
            key={type}
            onClick={() => {
              handleAddChild(type);
              setAnchorEl(null);
            }}
          >
            {type}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
