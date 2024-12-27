import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Check for overlapping events
    const overlappingEvent = await this.eventsRepository.findOne({
      where: {
        date: createEventDto.date,
        location: createEventDto.location,
      },
    });

    if (overlappingEvent) {
      throw new BadRequestException('An event already exists at this time and location');
    }
    if (createEventDto.max_attendees <= 0) {
      throw new BadRequestException('Maximum attendees must be positive');
    }

    const event = this.eventsRepository.create(createEventDto);
    const savedEvent = await this.eventsRepository.save(event);
    await this.cacheManager.del('events'); // Clear cache for updated data
    return savedEvent;
  }

  async findAll(date?: Date): Promise<Event[]> {
    const cachedEvents = await this.cacheManager.get<Event[]>('events');
    if (cachedEvents && !date) {
      return cachedEvents;
    }

    let query = this.eventsRepository.createQueryBuilder('event');

    if (date) {
      // Convert date to start and end of day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query = query.where('event.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const events = await query.getMany();

    if (!date) {
      await this.cacheManager.set('events', events, 3600);
    }

    return events;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }
  async findMostRegistered(): Promise<Event> {
    return this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.registrations', 'registration')
      .groupBy('event.id')
      .orderBy('COUNT(registration.id)', 'DESC')
      .getOne();
  }
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    const updatedEvent = Object.assign(event, updateEventDto);
    await this.cacheManager.del('events');
    return this.eventsRepository.save(updatedEvent);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
  
    // Count related registrations
    const relatedCount = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoin('event.registrations', 'registration')
      .where('event.id = :id', { id })
      .getCount();
  
    if (relatedCount > 0) {
      throw new BadRequestException(
        `Cannot delete event with ${relatedCount} existing registration(s). Please cancel all registrations before deleting the event.`
      );
    }
  
    await this.eventsRepository.remove(event);
    await this.cacheManager.del('events'); // Clear the cache after deletion
  }   
  async findEventWithMostRegistrations(): Promise<Event> {
    const result = await this.eventsRepository.query(`
      SELECT e.*, COUNT(r.id) as registration_count
      FROM event e
      LEFT JOIN registration r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY registration_count DESC
      LIMIT 1
    `);
    
    return result[0];
  }
}
