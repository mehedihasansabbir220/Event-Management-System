import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventReminderService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendEventReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const events = await this.eventsRepository.find({
      where: {
        date: Between(new Date(), tomorrow), // Use Between to avoid duplicate keys
      },
      relations: ['registrations', 'registrations.attendee'],
    });
  
    for (const event of events) {
      for (const registration of event.registrations) {
        await this.emailQueue.add('event-reminder', {
          attendeeEmail: registration.attendee.email,
          attendeeName: registration.attendee.name,
          eventName: event.name,
          eventDate: event.date,
        });
      }
    }
  }
}