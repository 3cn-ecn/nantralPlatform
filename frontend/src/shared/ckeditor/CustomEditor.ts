import { Autoformat } from '@ckeditor/ckeditor5-autoformat/';
import { Bold, Italic, Strikethrough } from '@ckeditor/ckeditor5-basic-styles/';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote/';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic/';
import { Essentials } from '@ckeditor/ckeditor5-essentials/';
import { Heading } from '@ckeditor/ckeditor5-heading/';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line/';
import { Indent } from '@ckeditor/ckeditor5-indent/';
import { AutoLink, Link } from '@ckeditor/ckeditor5-link/';
import { List } from '@ckeditor/ckeditor5-list/';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed/';
import { Mention } from '@ckeditor/ckeditor5-mention/';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph/';
import { TextTransformation } from '@ckeditor/ckeditor5-typing/';

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
  language: 'fr',
  link: {
    addTargetToExternalLinks: true, // open in new tab by default
    defaultProtocol: 'https://', // add https when missing
  },
  mediaEmbed: {
    previewsInData: true,
  },
};
