export interface Processor {
  process(buffer: Buffer): Promise<Buffer>;
  isTypeSupported(mimetype: string): boolean;
}
