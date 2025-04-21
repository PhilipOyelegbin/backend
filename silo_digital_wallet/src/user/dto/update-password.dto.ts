import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'New password',
    type: String,
    example: ']mTy3Rphd+gtMyvd',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The password must be minimum of 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Old password',
    type: String,
    example: 'password123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The password must be minimum of 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  oldPassword: string;
}
