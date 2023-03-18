import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { CommentModel } from './models/comment.model';
import { CommentController } from './controller';
import { FileService } from './services/file.service';
import { CommentService } from './services/comment.service';
import { UserService } from './services/user.service';
import { FileModel } from './models/file.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [UserModel, CommentModel, FileModel],
    }),
  ],

  controllers: [CommentController],
  providers: [FileService, CommentService, UserService],
})
export class AppModule {}
