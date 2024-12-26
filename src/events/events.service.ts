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
  
  @Injectable()
  export class EventsService {
    constructor(
      @InjectRepository(Event)
      private eventsRepository: Repository<Event>,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}
  
    async create(createEventDto: CreateEventDto): Promise<Event> {
      if (createEventDto.max_attendees <= 0) {
        throw new BadRequestException('Maximum attendees must be positive');
      }
  
      const event = this.eventsRepository.create(createEventDto);
      const savedEvent = await this.eventsRepository.save(event);
      await this.cacheManager.del('events'); // Clear cache for updated data
      return savedEvent;
    }
  
    async findAll(date: Date): Promise<Event[]> {
        const cachedEvents = await this.cacheManager.get<Event[]>('events');
        if (cachedEvents) {
          return cachedEvents;
        }
      
        const events = await this.eventsRepository.find();
        // Pass TTL as a separate argument
        await this.cacheManager.set('events', events, 3600);
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
  }
  