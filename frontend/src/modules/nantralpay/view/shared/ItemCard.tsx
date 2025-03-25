import { useState } from 'react';
import { CardFooter } from 'react-bootstrap';

import { Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { ItemPreview } from '#modules/nantralpay/types/item.type';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ModalDeleteItem } from './Modal/ModalDeleteItem';
import { ModalEditItem } from './Modal/ModalEditItem';

/**
 * A row of the table with a membership
 *
 * @param props
 * @returns
 */
function MembershipCard(props: {
  item: ItemPreview;
  updateItem?: (item: ItemPreview) => Promise<void>;
  deleteItem?: (item: ItemPreview) => Promise<void>;
}) {
  const { t } = useTranslation();
  const { item } = props;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  //const today = new Date(new Date().toDateString());
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card variant="outlined" sx={{ height: '100%', borderColor: 'primary' }}>
        <CardActionArea sx={{ height: '100%' }}>
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body1" noWrap>
                {item.name}
              </Typography>
              <Typography variant="body2" color="secondary" noWrap>
                {item.price} €
              </Typography>
            </Box>
          </CardContent>
          <CardFooter>
            <Button
              hidden={!openEditModal}
              onClick={() => setOpenEditModal(true)}
              variant="outlined"
              endIcon={<EditIcon />}
              sx={{ marginLeft: 1 }}
            >
              Edit
            </Button>
            <Button
              hidden={!openDeleteModal}
              onClick={() => setOpenDeleteModal(true)}
              variant="outlined"
              endIcon={<EditIcon />}
              sx={{ marginLeft: 1 }}
            >
              Delete
            </Button>
          </CardFooter>
        </CardActionArea>
      </Card>
      {openEditModal && item && (
        <ModalEditItem onClose={() => setOpenEditModal(false)} item={item} />
      )}
      <ModalDeleteItem
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        item={item}
      />
    </Grid>
  );
}

export default MembershipCard;
