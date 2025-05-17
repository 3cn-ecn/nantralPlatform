import { QRCodeDTO } from '#modules/nantralpay/infra/qrCode.dto';
import { QRCode } from '#modules/nantralpay/types/qrCode.type';

export function adaptQRCode(qrCodeDto: QRCodeDTO): QRCode {
  return {
    uuid: qrCodeDto.uuid,
    expirationDate: new Date(qrCodeDto.expiration_date),
    orderId: qrCodeDto.object_id,
  };
}
