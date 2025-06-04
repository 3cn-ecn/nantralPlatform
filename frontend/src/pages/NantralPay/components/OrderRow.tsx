import {
  Cancel,
  CheckCircle,
  Delete,
  Edit,
  Help,
  Pending,
  QrCode,
  Save,
  Verified,
} from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { upperFirst } from 'lodash-es';

import { Order } from '#modules/nantralpay/types/order.type';
import { useTranslation } from '#shared/i18n/useTranslation';

interface OrderRowProps {
  order: Order;
  onClick: () => void;
  onClickQRCode: () => void;
}

export function OrderRow({ order, onClick, onClickQRCode }: OrderRowProps) {
  const { formatDateTime, formatPrice } = useTranslation();
  /*
  Possible action for each status:
                      | Shown  | Cancel | QRCode |
  SAVED               | x      | x      |        |
  PENDING             | x      |    (1) |        |
  CANCELED            | x      |        |        |
  CONPLETED           | x      | x      | x      |
  VALIDATED           | x      |        |        |
  UNKNOWN             |        |        |        |
  
  (1) Can't cancel pending events because we are already waiting for a change of status
   */

  function getStatusIcon(status: string) {
    switch (status) {
      case 'Saved':
        return <Save />;
      case 'Pending':
        return <Pending />;
      case 'Canceled':
        return <Cancel />;
      case 'Completed':
        return <CheckCircle />;
      case 'Validated':
        return <Verified />;
      default:
        return <Help />;
    }
  }

  if (order.status == 'Unknown') {
    return;
  }

  return (
    <TableRow sx={{ textDecoration: 'none' }} hover onClick={onClick}>
      <TableCell>{formatPrice(order.amount)}</TableCell>
      <TableCell>{upperFirst(formatDateTime(order.date))}</TableCell>
      <TableCell>{order.sender}</TableCell>
      <TableCell>{order.receiver}</TableCell>
      <TableCell>
        <Tooltip title={order.status}>{getStatusIcon(order.status)}</Tooltip>
      </TableCell>
      <TableCell>
        {(order.status == 'Saved' || order.status == 'Completed') && (
          <IconButton>
            <Delete />
          </IconButton>
        )}
        {order.status == 'Completed' && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              onClickQRCode();
            }}
          >
            <QrCode />
          </IconButton>
        )}
        {order.status == 'Saved' && (
          <IconButton>
            <Edit />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
}
