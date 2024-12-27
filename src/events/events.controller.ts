import { Controller, Get, Post, Body, Param, Query, UseInterceptors, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { Event } from '../entities/event.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { EventsGateway } from 'src/websocket/events.gateway';
import { UpdateEventDto } from 'src/dto/update-event.dto';

@ApiTags('events')
@Controller('events')
@UseInterceptors(CacheInterceptor)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: EventsGateway,
  ) { }

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

  @Patch(':id')
  @ApiOperation({ summary: 'Update event details' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }
}