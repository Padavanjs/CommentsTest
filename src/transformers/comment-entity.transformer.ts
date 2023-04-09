import { Injectable } from '@nestjs/common/decorators';
import { CommentsParentEntity } from '../entities/comment-parent.entity';
import { CommentWithChildrenEntity } from '../entities/comment-with-children.entity';
import { CommentEntity } from '../entities/comment.entity';
import { CommentModel } from '../models/comment.model';
import { CommentTreeElement } from 'src/types/comment.types';

@Injectable()
export class CommentEntityTransformer {
  commentEntityTransform(comment: CommentModel): CommentEntity {
    const responseEntity = new CommentEntity({
      id: comment.id,
      username: comment.user.username,
      email: comment.user.email,
      text: comment.text,
      createdAt: comment.createdAt,
      parentId: comment.parentId,
    });
    if (comment.file) {
      responseEntity.setFile({
        type: comment.file.type,
        path: comment.file.name,
      });
    }
    return responseEntity;
  }

  parentCommentTransform(data: {
    rows: CommentModel[];
    count: number;
  }): CommentsParentEntity {
    const parentEntity = data.rows.map((comment) =>
      this.commentEntityTransform(comment),
    );
    return new CommentsParentEntity(data.count, parentEntity);
  }

  commentWithChildrenTransform(
    comment: CommentModel,
  ): CommentWithChildrenEntity {
    const entityWithChild = CommentWithChildrenEntity.createFromCommentEntity(
      this.commentEntityTransform(comment),
    );
    const childrenComments = comment.children.map((commentChild) =>
      this.commentEntityTransform(commentChild),
    );

    entityWithChild.setChildren(childrenComments);
    return entityWithChild;
  }

  transformCommentTreeElement(comment: CommentTreeElement): CommentEntity {
    const responseEntity = new CommentEntity({
      id: comment.id,
      username: comment.username,
      email: comment.email,
      text: comment.text,
      createdAt: comment.createdAt,
      parentId: comment.parentId,
    });
    if (comment.fileName && comment.fileType) {
      responseEntity.setFile({
        type: comment.fileType,
        path: comment.fileName,
      });
    }
    return responseEntity;
  }
}
