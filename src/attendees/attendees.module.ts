import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';
import { Attendee } from '../entities/attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  providers: [AttendeesService],
  controllers: [AttendeesController],
  exports: [AttendeesService]
})
export class AttendeesModule {}