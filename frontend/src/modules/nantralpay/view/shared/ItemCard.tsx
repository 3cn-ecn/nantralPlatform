import { useState } from 'react';

import {
  DeleteForever as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { ItemPreview } from '#modules/nantralpay/types/item.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
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
    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
      <Card variant="outlined" sx={{ height: '100%', borderColor: 'primary' }}>
        <CardContent sx={{ p: 1 }}>
          <FlexRow justifyContent="space-between" sx={{ mx: 1 }}>
            <Typography variant="body1" noWrap>
              {item.name}
            </Typography>
            <Typography variant="body1" color="secondary" noWrap>
              {item.price} €
            </Typography>
          </FlexRow>
        </CardContent>
        <CardActions>
          <Button
            hidden={!openEditModal}
            onClick={() => setOpenEditModal(true)}
            variant="outlined"
            size="small"
            endIcon={<EditIcon />}
            sx={{ marginLeft: 1 }}
          >
            {t('button.edit')}
          </Button>
          <Button
            hidden={!openDeleteModal}
            onClick={() => setOpenDeleteModal(true)}
            variant="outlined"
            size="small"
            endIcon={<DeleteIcon />}
            sx={{ marginLeft: 1 }}
          >
            {t('button.delete')}
          </Button>
        </CardActions>
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
