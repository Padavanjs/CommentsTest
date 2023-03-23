import { HttpException, HttpStatus } from '@nestjs/common';

export const validationFile = (file: Express.Multer.File) => {
  const mimetypeSucces = ['text/plain', 'image/gif', 'image/jpeg', 'image/png'];
  if (!mimetypeSucces.includes(file.mimetype)) {
    throw new HttpException('Invalid File', HttpStatus.UNPROCESSABLE_ENTITY);
  }
  const oneHundredKilos = 100000;
  if (file.size > oneHundredKilos) {
    throw new HttpException(
      'File is too large,',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
  return file;
};
