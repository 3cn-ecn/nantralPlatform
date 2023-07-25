/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

export default class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
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

// Editor configuration.
Editor.defaultConfig = {
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
    decorators: {
      // check-box in options
      openInNewTab: {
        mode: 'manual',
        label: 'Ouvrir dans un nouvel onglet',
        attributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    },
  },
};
