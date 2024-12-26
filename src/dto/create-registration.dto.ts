import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  event_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  attendee_id: string;
}