import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Registration } from '../entities/registration.entity';
import { EventsService } from '../events/events.service';
import { AttendeesService } from '../attendees/attendees.service';
import { CreateRegistrationDto } from 'src/dto/create-registration.dto';
import { EventsGateway } from 'src/websocket/events.gateway';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    private eventsService: EventsService,
    private attendeesService: AttendeesService,
    private eventsGateway: EventsGateway, // Inject EventsGateway
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const event = await this.eventsService.findOne(createRegistrationDto.event_id);
    const attendee = await this.attendeesService.findOne(createRegistrationDto.attendee_id);

    // Check for event capacity
    const registrationCount = await this.registrationsRepository.count({
      where: { event: { id: event.id } },
    });

    if (registrationCount >= event.max_attendees) {
      throw new BadRequestException('Event is full');
    }

    // Check for duplicate registration
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

    // Send confirmation email
    await this.emailQueue.add('registration-confirmation', {
      attendeeEmail: attendee.email,
      attendeeName: attendee.name,
      eventName: event.name,
      eventDate: event.date,
      location: event.location,
    });

    // Check remaining spots
    const remainingSpots = event.max_attendees - (registrationCount + 1);
    if (remainingSpots <= 2) {
      this.eventsGateway.notifySpotsFilling(event.id, remainingSpots); // Use the gateway
    }

    return savedRegistration;
  }

  async findByEventId(eventId: string): Promise<Registration[]> {
    return await this.registrationsRepository.find({
      where: { event: { id: eventId } },
      relations: ['attendee'],
    });
  }

  async remove(id: string): Promise<void> {
    const registration = await this.registrationsRepository.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }
    await this.registrationsRepository.remove(registration);
  }
}
