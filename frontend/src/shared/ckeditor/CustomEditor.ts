import {
  Autoformat,
  AutoLink,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  HorizontalLine,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Mention,
  Paragraph,
  Strikethrough,
  TextTransformation,
} from 'ckeditor5';

import { CKEditorTranslations } from './getCKEditorLanguage';

export class CustomEditor extends ClassicEditor {}

// Plugins to include in the build.
CustomEditor.builtinPlugins = [
  Autoformat,
  AutoLink,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  HorizontalLine,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Mention,
  Paragraph,
  Strikethrough,
  TextTransformation,
];

// CustomEditor configuration.
CustomEditor.defaultConfig = {
  licenseKey: 'GPL',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'link',
      '|',
      'blockQuote',
      'mediaEmbed',
      'horizontalLine',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
      '|',
      'undo',
      'redo',
    ],
  },
  translations: CKEditorTranslations,
  link: {
    addTargetToExternalLinks: true, // open in new tab by default
    defaultProtocol: 'https://', // add https when missing
  },
  mediaEmbed: {
    previewsInData: true,
  },
};
