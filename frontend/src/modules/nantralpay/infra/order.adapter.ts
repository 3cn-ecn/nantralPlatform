import { Order } from '../types/order.type';
import { OrderDTO } from './order.dto';

export function adaptOrder(orderDto: OrderDTO): Order {
  return {
    id: orderDto.id,
    amount: orderDto.amount,
    date: new Date(orderDto.payment_date),
    haOrderId: orderDto.order,
    haPaymentID: orderDto.helloasso_payment_id,
    status: orderDto.payment_status,
    description: orderDto.description,
    receiver: orderDto.receiver,
    scanned: orderDto.scanned,
  };
}
