import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from '../entities/event.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { EventsGateway } from 'src/websocket/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    CacheModule.register()
  ],
  providers: [EventsService, EventsGateway],
  controllers: [EventsController],
  exports: [EventsService]
})
export class EventsModule {}