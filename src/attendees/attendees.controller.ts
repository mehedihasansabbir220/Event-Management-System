import { Controller, Get, Post, Body, Param, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';

@ApiTags('attendees')
@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) { }

  @Post()
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeesService.create(createAttendeeDto);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.attendeesService.findAll(search);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendee' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.attendeesService.remove(id);
  }
}