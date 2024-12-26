import { Controller, Get, Post, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { Event } from '../entities/event.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('events')
@Controller('events')
@UseInterceptors(CacheInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll(@Query('date') date?: Date): Promise<Event[]> {
    return this.eventsService.findAll(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }
}