import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Registration } from '../entities/registration.entity';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { EventsModule } from '../events/events.module';
import { AttendeesModule } from '../attendees/attendees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration]),
    BullModule.registerQueue({
      name: 'email',
    }),
    EventsModule,
    AttendeesModule,
  ],
  providers: [RegistrationsService],
  controllers: [RegistrationsController],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}