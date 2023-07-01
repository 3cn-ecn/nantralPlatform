import { AxiosError } from 'axios';

export type DjangoRestApiFieldValidationError<DTO> = {
  [K in keyof DTO]?: string[];
};

type DjangoRestApiNonFieldValidationError = {
  non_field_errors?: string[];
};

type DjangoRestApiGenericError = {
  detail?: string;
};

type DjangoRestApiError<DTO> = DjangoRestApiGenericError &
  DjangoRestApiFieldValidationError<DTO> &
  DjangoRestApiNonFieldValidationError;

export type ApiErrorDTO<DTO> = AxiosError<DjangoRestApiError<DTO> | null>;
