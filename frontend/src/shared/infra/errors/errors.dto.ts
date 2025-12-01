import { AxiosError } from 'axios';

export type DjangoRestApiFieldValidationError<DTO> = {
  [K in keyof DTO]?: NonNullable<DTO[K]> extends File | Blob
    ? string[]
    : NonNullable<DTO[K]> extends object
      ? DjangoRestApiFieldValidationError<DTO[K]>
      : string[];
};

interface DjangoRestApiNonFieldValidationError {
  non_field_errors?: string[];
}

interface DjangoRestApiGenericError {
  detail?: string;
}

type DjangoRestApiError<DTO> = DjangoRestApiGenericError &
  DjangoRestApiFieldValidationError<DTO> &
  DjangoRestApiNonFieldValidationError;

export type ApiFormErrorDTO<DTO> = AxiosError<DjangoRestApiError<DTO> | null>;

export type ApiErrorDTO = ApiFormErrorDTO<Record<string, never>>;
