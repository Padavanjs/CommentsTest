import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderItem } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CommentModel } from '../models/comment.model';
import { FileModel } from '../models/file.model';
import { UserModel } from '../models/user.model';
import { CommentTreeElement } from '../types/comment.types';
import { cleaningText } from '../utils/customValidator';
import { CommentEntityTransformer } from 'src/transformers/comment-entity.transformer';
import { CommentEntity } from 'src/entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: typeof CommentModel,
    private sequelize: Sequelize,
    private commentTransformer: CommentEntityTransformer,
  ) {}
  async createComment(
    filthyText: string,
    userId: number,
    parentId: number,
    fileId?: number,
  ): Promise<CommentModel> {
    const text = cleaningText(filthyText);
    return this.commentRepository.create({
      userId,
      text,
      parentId,
      fileId,
      createdAt: new Date(),
    });
  }

  async getParentComments(
    page = 1,
    sortKey?: string,
    sortDir?: string,
  ): Promise<{ rows: CommentModel[]; count: number }> {
    const limit = 25;
    const offset = page * limit - limit;

    let orderCondition: OrderItem =
      sortKey && sortDir ? [sortKey, sortDir] : ['createdAt', 'desc'];

    if (sortKey === 'username' || sortKey === 'email') {
      orderCondition.unshift('user');
    }

    return this.commentRepository.findAndCountAll({
      limit,
      offset,
      where: { parentId: null },
      include: [
        {
          model: FileModel,
          as: 'file',
        },
        {
          model: UserModel,
          as: 'user',
        },
      ],
      order: orderCondition ? [orderCondition] : [],
    });
  }

  async getCommentByIdWithChildren(id: number): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      include: [
        {
          model: CommentModel,
          include: [
            {
              model: FileModel,
            },
            {
              model: UserModel,
            },
          ],
        },
        {
          model: FileModel,
        },
        {
          model: UserModel,
        },
      ],
    });

    if (!comment) {
      return;
    }

    const childrenComments = await this.getCommentChildren(comment.id);
    const tree = this.mapCommentsToTree(childrenComments, comment.id);
    console.log(tree);

    const commentResponse =
      this.commentTransformer.commentEntityTransform(comment);
    commentResponse.setChildren(tree);
    return commentResponse;
  }

  async getCommentChildren(commentId: number): Promise<Array<CommentEntity>> {
    if (Number.isNaN(+commentId)) {
      throw new BadRequestException();
    }
    const [result] = await this.sequelize.query(`
      WITH RECURSIVE comments_tree AS (
        SELECT 
          com.id, 
          com.parentId AS parentId,
          com.text AS 'text',
          com.createdAt,
          f.name AS 'fileName', 
          f.type AS 'fileType', 
          u.username, 
          u.email
          
        FROM comments AS com
          
        LEFT JOIN files f ON com.fileId = f.id
        LEFT JOIN users u ON com.userId= u.id
    
        WHERE parentId = ${commentId}
          
        UNION ALL
          
        SELECT 
          
          t.id, 
          t.parentId, 
          t.text, 
          t.createdAt,
          f.name, 
          f.type, 
          u.username, 
          u.email
    
        FROM comments as t
        JOIN comments_tree p ON t.parentId= p.id
        LEFT JOIN files as f ON t.fileId = f.id
        LEFT JOIN users u ON t.userId= u.id
      )
      SELECT *
      FROM comments_tree
      ORDER BY createdAt DESC
   `);

    return (result as Array<CommentTreeElement>).map((comment) =>
      this.commentTransformer.transformCommentTreeElement(comment),
    );
  }

  private mapCommentsToTree(
    comments: CommentEntity[],
    parentId: number | undefined = undefined,
  ): CommentEntity[] {
    return comments
      .filter((com: CommentEntity) => com.parentId === parentId)
      .map((com: CommentEntity) => {
        com.setChildren(this.mapCommentsToTree(comments, com.id));
        return com;
      });
  }
}
