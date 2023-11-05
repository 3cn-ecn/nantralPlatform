import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';

import { getSignatureInfoApi } from '../api/getSignature.api';
import { SignatureInfo } from '../signature.type';

export function useSignatureInfo(options: UseQueryOptions<SignatureInfo> = {}) {
  const query = useQuery<SignatureInfo, ApiError>({
    queryKey: ['signature-infos'],
    queryFn: ({ signal }) => getSignatureInfoApi(signal),
    ...options,
  });

  return query;
}
