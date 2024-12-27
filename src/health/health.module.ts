import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { CustomHealthIndicator } from './indicators/custom.health';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [
    TerminusModule,
    HttpModule
  ],
  controllers: [HealthController],
  providers: [HealthService, CustomHealthIndicator]
})
export class HealthModule {}