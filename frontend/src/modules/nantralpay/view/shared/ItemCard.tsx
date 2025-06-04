import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

import { Event } from '#modules/event/event.type';
import { Item } from '#modules/nantralpay/types/item.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { ButtonNumberField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

const DEFAULT_ITEM_IMAGE = '/static/img/default-item.png';

function ItemCard(props: {
  item: Item;
  event?: Event;
  errors?: string[];
  quantity: number;
  setQuantity: (quantity: number) => void;
}) {
  const { t, formatPrice } = useTranslation();
  const { item, errors, quantity, setQuantity } = props;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
      <Card variant="outlined" sx={{ height: '100%', borderColor: 'primary' }}>
        <CardMedia
          component="img"
          height="140"
          image={item.image || DEFAULT_ITEM_IMAGE}
          title={item.name}
          alt={item.name}
          loading="lazy"
        />
        <CardContent sx={{ p: 1 }}>
          <FlexRow justifyContent="space-between" sx={{ mx: 1 }}>
            <Typography variant="body1" noWrap>
              {item.name}
            </Typography>
            <Typography variant="body1" color="secondary" noWrap>
              {formatPrice(item.price)}
            </Typography>
          </FlexRow>
        </CardContent>
        <CardActions>
          <ButtonNumberField
            name={'quantity-' + item.id}
            label={t('nantralpay.order.form.quantity.label')}
            value={quantity}
            handleChange={setQuantity}
            errors={errors}
            required
          />
        </CardActions>
      </Card>
    </Grid>
  );
}

export default ItemCard;
