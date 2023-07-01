import { DjangoRestApiFieldValidationError } from './errors.dto';

export type ApiError<DTO> = DjangoRestApiFieldValidationError<DTO> & {
  globalErrors?: string[];
};
