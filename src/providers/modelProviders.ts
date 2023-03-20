import { CommentModel } from 'src/models/comment.model';
import { FileModel } from 'src/models/file.model';
import { UserModel } from 'src/models/user.model';

export const modelProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: UserModel,
  },
  {
    provide: 'COMMENT_REPOSITORY',
    useValue: CommentModel,
  },
  {
    provide: 'FILE_REPOSITORY',
    useValue: FileModel,
  },
];
