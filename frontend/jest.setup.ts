import { ReadableStream, TransformStream } from 'stream/web';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, {
  ReadableStream,
  TransformStream,
  TextDecoder,
  TextEncoder,
});
