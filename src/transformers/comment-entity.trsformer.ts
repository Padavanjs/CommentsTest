import { Injectable } from '@nestjs/common/decorators';
import { CommentsParentEntity } from 'src/entities/comment-parent.entity';
import { CommentWithChildrenEntity } from 'src/entities/comment-With-Children.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { CommentModel } from 'src/models/comment.model';

@Injectable()
export class CommentEntityTransformer {
  commentEntityTransform(comment: CommentModel): CommentEntity {
    const responseEntity = new CommentEntity({
      id: comment.id,
      username: comment.user.username,
      email: comment.user.email,
      text: comment.text,
      createdAt: comment.createdAt,
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
    comments: CommentModel[],
  ): CommentWithChildrenEntity[] {
    return comments.map((rootComment) => {
      const entityWithChild = CommentWithChildrenEntity.createFromCommentEntity(
        this.commentEntityTransform(rootComment),
      );
      const childrenComments = rootComment.children.map((commentChild) =>
        this.commentEntityTransform(commentChild),
      );
      entityWithChild.setChildren(childrenComments);
      return entityWithChild;
    });
  }
}
