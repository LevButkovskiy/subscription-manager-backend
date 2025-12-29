import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FindOneDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;
}
