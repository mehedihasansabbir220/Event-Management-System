import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Registration } from '../entities/registration.entity';
import { EventsService } from '../events/events.service';
import { AttendeesService } from '../attendees/attendees.service';
import { CreateRegistrationDto } from 'src/dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    private eventsService: EventsService,
    private attendeesService: AttendeesService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const event = await this.eventsService.findOne(createRegistrationDto.event_id);
    const attendee = await this.attendeesService.findOne(createRegistrationDto.attendee_id);

    const registrationCount = await this.registrationsRepository.count({
      where: { event: { id: event.id } },
    });

    if (registrationCount >= event.max_attendees) {
      throw new BadRequestException('Event is full');
    }

    const existingRegistration = await this.registrationsRepository.findOne({
      where: {
        event: { id: event.id },
        attendee: { id: attendee.id },
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('Attendee already registered for this event');
    }

    const registration = this.registrationsRepository.create({
      event,
      attendee,
    });

    const savedRegistration = await this.registrationsRepository.save(registration);

    await this.emailQueue.add('registration-confirmation', {
      attendeeEmail: attendee.email,
      attendeeName: attendee.name,
      eventName: event.name,
      eventDate: event.date,
    });

    return savedRegistration;
  }

  async findByEventId(eventId: string): Promise<Registration[]> {
    return await this.registrationsRepository.find({
      where: { event: { id: eventId } },
      relations: ['attendee'],
    });
  }
}
