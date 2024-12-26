import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from '../entities/event.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    CacheModule.register()
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService]
})
export class EventsModule {}