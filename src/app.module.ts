import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { CommentModel } from './models/comment.model';
import { AppController } from './app.controller';
import { FileService } from './services/file.service';
import { CommentService } from './services/comment.service';
import { UserService } from './services/user.service';
import { FileModel } from './models/file.model';
import { FILE_PROCESSORS } from './processors/classes';
import { FileProcessor } from './processors/file.processor';
import { CommentEntityTransformer } from './transformers/comment-entity.transformer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          dialect: 'mysql',
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          models: [UserModel, CommentModel, FileModel],
          synchronize: false,
          define: {
            timestamps: false,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],

  controllers: [AppController],
  providers: [
    UserService,
    CommentService,
    FileService,
    FileProcessor,
    CommentEntityTransformer,
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
    {
      provide: 'FILE_PROCESSORS',
      useValue: FILE_PROCESSORS,
    },
  ],
})
export class AppModule {}
