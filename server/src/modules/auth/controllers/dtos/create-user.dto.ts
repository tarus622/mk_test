import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  password: string;
}
