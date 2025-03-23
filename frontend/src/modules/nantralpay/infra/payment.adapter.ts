import { Payment, PaymentPreview } from '../types/payment.type';
import { PaymentDTO, PaymentPreviewDTO } from './payment.dto';

export function adaptPayment(paymentDto: PaymentDTO): Payment {
  return {
    id: paymentDto.id,
    amount: paymentDto.amount,
    date: new Date(paymentDto.payment_date),
    haOrderId: paymentDto.order,
    haPaymentID: paymentDto.helloasso_payment_id,
    status: paymentDto.payment_status,
  };
}

export function adaptPaymentPreview(
  paymentDto: PaymentPreviewDTO,
): PaymentPreview {
  return {
    id: paymentDto.id,
    amount: paymentDto.amount || 0,
    date: new Date(paymentDto.payment_date) || new Date(),
    status: paymentDto.payment_status || 'Unknown',
    haOrderId: paymentDto.order || 0,
    haPaymentID: paymentDto.helloasso_payment_id || 0,
  };
}
