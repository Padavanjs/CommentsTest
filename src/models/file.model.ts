import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class FileModel extends Model<FileModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
}
