import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../auth/schemas/user.schema';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly endDate: Date;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @IsOptional()
  @IsNumber()
  readonly duration: number;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
