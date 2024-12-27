import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CustomHealthIndicator extends HealthIndicator {
  private redis: Redis;
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    super();

    // Initialize Redis client
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      await this.redis.ping();
      return this.getStatus('redis', true);
    } catch (error) {
      return this.getStatus('redis', false, { message: error.message });
    }
  }

  async checkEmailService(): Promise<HealthIndicatorResult> {
    try {
      await this.emailTransporter.verify();
      return this.getStatus('email_service', true);
    } catch (error) {
      return this.getStatus('email_service', false, { message: error.message });
    }
  }

  // Change visibility from private to protected
  protected getStatus(key: string, isHealthy: boolean, data: any = {}): HealthIndicatorResult {
    return {
      [key]: {
        status: isHealthy ? 'up' : 'down',
        ...data,
      },
    };
  }
}
