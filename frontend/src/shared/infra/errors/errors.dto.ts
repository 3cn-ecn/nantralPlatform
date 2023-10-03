import { AxiosError } from 'axios';

export type DjangoRestApiFieldValidationError<DTO> = {
  [K in keyof DTO]?: string[];
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
