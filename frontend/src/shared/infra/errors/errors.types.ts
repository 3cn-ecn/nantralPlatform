import {
  ApiErrorDTO,
  ApiFormErrorDTO,
  DjangoRestApiFieldValidationError,
} from './errors.dto';

export type ApiFormError<DTO> = ApiFormErrorDTO<DTO> & {
  fields: DjangoRestApiFieldValidationError<DTO>;
  globalErrors?: string[];
};

export type ApiError = ApiErrorDTO & {
  message: string;
};
