import { CommentEntity } from './comment.entity';

export class CommentWithChildrenEntity extends CommentEntity {
  children: CommentEntity[];

  setChildren(arr: CommentEntity[]) {
    this.children = arr;
  }

  static createFromCommentEntity(
    entity: CommentEntity,
  ): CommentWithChildrenEntity {
    return new CommentWithChildrenEntity(entity);
  }
}
