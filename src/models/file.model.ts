import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { CommentModel } from './comment.model';

@Table({ tableName: 'files' })
export class FileModel extends Model<FileModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @BelongsTo(() => CommentModel)
  comment: CommentModel;

  @ForeignKey(() => CommentModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  commentId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
}
