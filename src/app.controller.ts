import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import { CommentService } from './services/comment.service';
import { FileService } from './services/file.service';
import { UserService } from './services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { validationFile } from './utils/validationFile';
import { CommentEntity } from './entities/comment.entity';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { QueryDto } from './dto/query.dto';
import { CommentsParentEntity } from './entities/comment-parent.entity';
import { CommentEntityTransformer } from './transformers/comment-entity.transformer';
import { CommentModel } from './models/comment.model';

@ApiTags('comments')
@Controller('/comments')
export class AppController {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private fileService: FileService,
    private transformer: CommentEntityTransformer,
  ) {}

  @Post('/')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CommentEntity,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  async createComment(
    @Body() data: CreateCommentDto,
    @UploadedFile()
    file?: Express.Multer.File,
    @Query('parentId') parentId?: number,
  ): Promise<CommentEntity> {
    let uploadedFile;

    if (file) {
      const validFile = validationFile(file);
      uploadedFile = await this.fileService.create(validFile);
    }
    const user = await this.userService.create(data.email, data.username);
    const comment = await this.commentService.createComment(
      data.text,
      user.id,
      parentId,
      uploadedFile?.id,
    );

    return this.transformer.commentEntityTransform({
      ...comment.toJSON(),
      user: user,
      file: uploadedFile,
    } as CommentModel);
  }

  @Get()
  async getParentComments(
    @Query() query: QueryDto,
  ): Promise<CommentsParentEntity> {
    const comments = await this.commentService.getParentComments(
      query.page,
      query.sortKey,
      query.sortDir,
    );

    return this.transformer.parentCommentTransform(comments);
  }

  @Get('/:id')
  async getCommentWithFirstChildLevel(@Param('id') id: string) {
    if (Number.isNaN(+id)) {
      throw new BadRequestException();
    }
    return this.commentService.getCommentByIdWithChildren(+id);
  }
}
