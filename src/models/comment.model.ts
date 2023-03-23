import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { FileModel } from './file.model';
import { UserModel } from './user.model';

@Table({ tableName: 'comments' })
export class CommentModel extends Model<CommentModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @ForeignKey(() => CommentModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parentId?: number;

  @HasMany(() => CommentModel)
  children: CommentModel[];

  @BelongsTo(() => FileModel)
  file: FileModel;

  @ForeignKey(() => FileModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileId: number;
}
