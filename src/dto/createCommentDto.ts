import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  text: string;
}
