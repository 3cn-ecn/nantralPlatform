export type LoadStatus = 'load' | 'fail' | 'success';

/** Props for multi-page response */
export interface ListResults<T> {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
}

export type FieldType =
  | {
      kind: 'text' | 'integer' | 'float' | 'link';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      rows?: number;
      disabled?: boolean;
    }
  | {
      kind: 'boolean';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      rows: number;
      disabled?: boolean;
    }
  | {
      kind: 'date' | 'datetime';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      disabled?: boolean;
      disablePast?: boolean;
      rows?: number;
    }
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min: number;
      max?: number;
      step: number;
      default?: number;
      disabled?: boolean;
    }
  | {
      kind: 'file';
      label: string;
      description: string;
      disabled?: boolean;
      name: string;
      required?: boolean;
    }
  | {
      kind: 'select';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      item?: Array<Array<string>>;
      disabled?: boolean;
    }
  | {
      kind: 'richtext';
      name: string;
      label: string;
      helpText?: string;
      disabled?: boolean;
    }
  | {
      kind: 'group';
      fields?: (FieldType & { name: string })[];
    }
  | {
      kind: 'custom';
      name: string;
      component: (props: { error?: boolean }) => JSX.Element;
    }
  | {
      kind: 'comment';
      name: string;
      text: string;
    }
  | {
      kind: 'autocomplete';
      name: string;
      label: string;
      required?: boolean;
      minLetterCount?: number;
      helpText?: string;
      endPoint?: string;
      queryParams?: object;
      freeSolo?: boolean;
      getOptionLabel: (option: any) => string;
      pk?: string;
      disabled?: boolean;
      options?: Array<any>;
    }
  | {
      kind: 'image-autocomplete';
      name: string;
      label: string;
      required?: boolean;
      helpText?: string;
      freeSolo?: boolean;
      getOptionLabel: (option: any) => string;
      getIcon: (option: any) => string;
      pk?: string;
      disabled?: boolean;
      options?: Array<any>;
    };
