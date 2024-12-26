import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';

@Entity()
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, event => event.registrations)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Attendee, attendee => attendee.registrations)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registered_at: Date;
}