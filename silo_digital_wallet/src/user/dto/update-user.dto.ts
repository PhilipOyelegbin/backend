import { PartialType } from '@nestjs/swagger';
import { RegisterAuthDto } from '../../auth/dto/register-auth.dto';

export class UpdateUserDto extends PartialType(RegisterAuthDto) {}
