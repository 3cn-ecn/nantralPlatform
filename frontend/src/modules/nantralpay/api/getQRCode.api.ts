import axios from 'axios';

import { QRCodeDTO } from '#modules/nantralpay/infra/qrCode.dto';
import { adaptApiErrors } from '#shared/infra/errors';

import { adaptQRCode } from '../infra/qrCode.adapter';

export async function getQRCodeApi(orderId: number) {
  const { data } = await axios
    .post<QRCodeDTO>(`/api/nantralpay/order/${orderId}/qrcode/`)
    .catch((error) => {
      throw adaptApiErrors(error);
    });
  return adaptQRCode(data);
}
