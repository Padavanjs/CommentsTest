import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
  HttpStatus,
  ParseFilePipe,
} from '@nestjs/common';
import { Express } from 'express';
import { CommentService } from './services/comment.service';
import { FileService } from './services/file.service';
import { UserService } from './services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/createCommentDto';

@Controller('/comments')
export class CommentController {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private fileService: FileService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createComment(
    @Body() data: CreateCommentDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif|plain)$/,
        })
        .addMaxSizeValidator({
          maxSize: 100000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
    @Query('parentId') parentId?: number,
  ) {
    const user = await this.userService.create(data.email, data.username);
    const finishedFile = await this.fileService.create(file);
    const comment = await this.commentService.createComment(
      data.text,
      user.id,
      parentId,
      finishedFile.id,
    );
    const commentForRes = {
      username: user.username,
      email: user.email,
      text: comment.text,
      createdAt: comment.createdAt,
      file: finishedFile.name,
    };
    return commentForRes;
  }
  @Get()
  async getParrentComments() {
    return await this.commentService.getParentComments();
  }

  @Get('/:id')
  async getOneComm(@Param('id') id: number) {
    return await this.commentService.getOneComment(id);
  }
}
