import { Inject, Injectable } from '@nestjs/common';
import { Processor } from './types/processor.interface';

@Injectable()
export class FileProcessor {
  constructor(
    @Inject('FILE_PROCESSORS') private processors: Array<Processor>,
  ) {}

  async processFile(buffer: Buffer, mimetype: string): Promise<Buffer> {
    const processor = this.getProcessorByType(mimetype);
    if (!processor) {
      return buffer;
    }
    return processor.process(buffer);
  }
  private getProcessorByType(type: string): Processor {
    return this.processors.find((pr) => pr.isTypeSupported(type));
  }
}
