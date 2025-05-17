import { Order } from '../types/order.type';
import { OrderDTO } from './order.dto';

export function adaptOrder(orderDto: OrderDTO): Order {
  return {
    id: orderDto.id,
    amount: orderDto.amount,
    date: new Date(orderDto.creation_date),
    haOrderID: orderDto.helloasso_order_id,
    status: orderDto.status,
    description: orderDto.description,
    receiver: orderDto.receiver,
    sender: orderDto.sender,
  };
}
