import { Inject, Injectable } from '@nestjs/common';
import { FileModel } from 'src/models/file.model';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @Inject('FILE_REPOSITORY')
    private fileRepository: typeof FileModel,
  ) {}

  async create(
    file: Express.Multer.File,
    commentId: number,
  ): Promise<FileModel> {
    // if (file.mimetype === 'txt') {
    //   const filePath = path.resolve(__dirname, '..', 'static', 'txt');
    //   fs.writeFileSync(path.resolve(filePath, file.originalname), file.buffer);
    //   return await this.fileModel.create({
    //     commentId,
    //     name: filePath + '/' + file.originalname,
    //   });
    // }
    const filePath = path.resolve(__dirname, '..', 'static', 'image');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    fs.writeFileSync(path.resolve(filePath, file.originalname), file.buffer);
    return await this.fileRepository.create({
      commentId,
      name: filePath + '/' + file.originalname,
    });
  }
}
