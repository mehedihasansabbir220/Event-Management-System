import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from '../dto/create-registration.dto';

@ApiTags('registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  @ApiOperation({ summary: 'Register attendee for event' })
  async create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationsService.create(createRegistrationDto);
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get all registrations for an event' })
  async findByEventId(@Param('eventId') eventId: string) {
    return this.registrationsService.findByEventId(eventId);
  }
}