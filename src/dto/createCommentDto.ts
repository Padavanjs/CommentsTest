import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  text: string;
}
