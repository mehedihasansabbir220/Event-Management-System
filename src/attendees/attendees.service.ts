import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from '../entities/attendee.entity';
import { CreateAttendeeDto } from 'src/dto/create-attendee.dto';


@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private attendeesRepository: Repository<Attendee>,
  ) {}

  async create(createAttendeeDto: CreateAttendeeDto): Promise<Attendee> {
    const existingAttendee = await this.attendeesRepository.findOne({
      where: { email: createAttendeeDto.email },
    });

    if (existingAttendee) {
      throw new ConflictException('Email already exists');
    }

    const attendee = this.attendeesRepository.create(createAttendeeDto);
    return await this.attendeesRepository.save(attendee);
  }

  async findAll(search: string): Promise<Attendee[]> {
    return await this.attendeesRepository.find();
  }

  async findOne(id: string): Promise<Attendee> {
    const attendee = await this.attendeesRepository.findOne({ where: { id } });
    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${id} not found`);
    }
    return attendee;
  }
  async findWithMultipleRegistrations(): Promise<Attendee[]> {
    return this.attendeesRepository
      .createQueryBuilder('attendee')
      .leftJoinAndSelect('attendee.registrations', 'registration')
      .groupBy('attendee.id')
      .having('COUNT(registration.id) > 1')
      .getMany();
  }
}