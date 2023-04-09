export type CommentTreeElement = {
  id: number;
  text: string;
  fileName?: string;
  fileType?: string;
  username: string;
  email: string;
  createdAt: Date;
  parentId: number;
};
