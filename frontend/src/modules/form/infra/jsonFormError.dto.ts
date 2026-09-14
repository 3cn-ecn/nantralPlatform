export interface JsonFormErrorDTO {
  validator: string;
  message: string;
  absolute_schema_path: string[];
  absolute_path: string[];
}
