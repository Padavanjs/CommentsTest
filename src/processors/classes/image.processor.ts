import * as jimp from 'jimp';
import { Processor } from '../types/processor.interface';

export class ImageProcessor implements Processor {
  async process(img: Buffer): Promise<Buffer> {
    const imageTemplate = await jimp.read(img);
    return imageTemplate.resize(320, 240).getBufferAsync(jimp.MIME_PNG);
  }
  isTypeSupported(mimetype: string): boolean {
    return mimetype.indexOf('image') !== -1;
  }
}
