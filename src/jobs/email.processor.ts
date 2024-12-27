import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('email')
export class EmailProcessor {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  @Process('registration-confirmation')
  async handleRegistrationConfirmation(job: Job) {
    const { attendeeEmail, attendeeName, eventName, eventDate } = job.data;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: attendeeEmail,
      subject: `Registration Confirmation: ${eventName}`,
      html: `
        <h1>Registration Confirmed</h1>
        <p>Dear ${attendeeName},</p>
        <p>Your registration for ${eventName} on ${new Date(eventDate).toLocaleDateString()} has been confirmed.</p>
      `,
    });
  }

  // Add the new event reminder method here
  @Process('event-reminder')
  async handleEventReminder(job: Job) {
    const { attendeeEmail, attendeeName, eventName, eventDate } = job.data;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: attendeeEmail,
      subject: `Reminder: ${eventName} Tomorrow`,
      html: `
        <h1>Event Reminder</h1>
        <p>Dear ${attendeeName},</p>
        <p>This is a reminder that ${eventName} is tomorrow at ${new Date(eventDate).toLocaleTimeString()}.</p>
        <p>We look forward to seeing you there!</p>
      `,
    });
  }
}