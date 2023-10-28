import axios, { GenericAbortSignal } from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptSignatureInfo } from '../infra/signature.adapter';
import { SignatureInfoDTO } from '../infra/signature.dto';
import { SignatureInfo } from '../signature.type';

export async function getSignatureInfoApi(
  signal?: GenericAbortSignal,
): Promise<SignatureInfo> {
  const { data } = await axios
    .get<SignatureInfoDTO>('/api/signature/', {
      signal: signal,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptSignatureInfo(data);
}
