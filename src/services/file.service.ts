import { Inject, Injectable } from '@nestjs/common';
import { FileModel } from 'src/models/file.model';
import * as path from 'path';
import * as fs from 'fs';
import { createRandomString } from 'src/utils/random';
import { FileProcessor } from 'src/processors/file.processor';

@Injectable()
export class FileService {
  constructor(
    @Inject('FILE_REPOSITORY')
    private fileRepository: typeof FileModel,
    private fileProcessor: FileProcessor,
  ) {}

  async create(file?: Express.Multer.File): Promise<FileModel> {
    if (!file) {
      return;
    }
    const dirPath = path.resolve(__dirname, '..', '..', 'static');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const fileName = createRandomString();
    const filePath = path.resolve(dirPath, fileName);
    const source = await this.fileProcessor.processFile(
      file.buffer,
      file.mimetype,
    );
    fs.writeFileSync(filePath, source);
    return this.fileRepository.create({
      type: file.mimetype,
      name: fileName,
    });
  }
}
