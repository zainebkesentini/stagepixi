import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../auth/schemas/user.schema';

export class UpdateLeaveDto {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Utilise class-transformer pour transformer les chaînes en objets Date
  readonly startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Utilise class-transformer pour transformer les chaînes en objets Date
  readonly endDate: Date;

  @IsOptional()
  @IsNumber()
  readonly duration: number;

  @IsOptional()
  @IsString()
  readonly reason: string;

  @IsOptional()
  @IsString()
  readonly status: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
