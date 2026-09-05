import {
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';

import { getSignatureInfoApi } from '../api/getSignature.api';
import { SignatureInfo } from '../signature.type';

export function useSignatureInfo(
  options: Partial<UseSuspenseQueryOptions<SignatureInfo, ApiError>> = {},
) {
  return useSuspenseQuery<SignatureInfo, ApiError>({
    queryKey: ['signature-infos'],
    queryFn: ({ signal }) => getSignatureInfoApi(signal),
    ...options,
  });
}
