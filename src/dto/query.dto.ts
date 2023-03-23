import { IsOptional, IsEnum } from 'class-validator';

export class QueryDto {
  page?: number;

  @IsOptional()
  @IsEnum(['username', 'email', 'createdAt'], {
    message: `Should be one of: 'username', 'email', 'createdAt'`,
  })
  sortKey?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: `Should be one of: 'asc', 'desc'`,
  })
  sortDir?: 'asc' | 'desc';
}
