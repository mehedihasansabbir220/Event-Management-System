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
  ) { }

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

  async findAll(search?: string): Promise<Attendee[]> {
    if (!search) {
      return this.attendeesRepository.find();
    }

    return this.attendeesRepository
      .createQueryBuilder('attendee')
      .where('LOWER(attendee.name) LIKE LOWER(:search)', { search: `%${search}%` })
      .orWhere('LOWER(attendee.email) LIKE LOWER(:search)', { search: `%${search}%` })
      .getMany();
  }

  async findOne(id: string): Promise<Attendee> {
    const attendee = await this.attendeesRepository.findOne({ where: { id } });
    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${id} not found`);
    }
    return attendee;
  }
  async findAttendeesWithMultipleRegistrations(): Promise<Attendee[]> {
    const result = await this.attendeesRepository.query(`
      SELECT a.*, COUNT(r.id) as registration_count
      FROM attendee a
      JOIN registration r ON a.id = r.attendee_id
      GROUP BY a.id
      HAVING COUNT(r.id) > 1
    `);
    
    return result;
  }
  async remove(id: string): Promise<void> {
    const attendee = await this.findOne(id);
    await this.attendeesRepository.remove(attendee);
  }
}