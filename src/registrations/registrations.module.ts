import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Registration } from '../entities/registration.entity';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { EventsModule } from '../events/events.module';
import { AttendeesModule } from '../attendees/attendees.module';
import { EventsGateway } from 'src/websocket/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration]),
    BullModule.registerQueue({
      name: 'email',
    }),
    EventsModule,
    AttendeesModule,
  ],
  providers: [RegistrationsService, EventsGateway],
  controllers: [RegistrationsController],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}