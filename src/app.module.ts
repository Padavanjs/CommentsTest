import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { CommentModel } from './models/comment.model';
import { CommentController } from './controller';
import { FileService } from './services/file.service';
import { CommentService } from './services/comment.service';
import { UserService } from './services/user.service';
import { FileModel } from './models/file.model';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { modelProviders } from './providers/modelProviders';

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
      define: {
        timestamps: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
  ],

  controllers: [CommentController],
  providers: [UserService, CommentService, FileService, ...modelProviders],
})
export class AppModule {}
