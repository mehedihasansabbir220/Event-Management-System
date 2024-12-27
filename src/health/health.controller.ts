import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check overall system health' })
  check() {
    return this.healthService.checkHealth();
  }

  @Get('database')
  @HealthCheck()
  @ApiOperation({ summary: 'Check database health' })
  checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Get('redis')
  @HealthCheck()
  @ApiOperation({ summary: 'Check Redis health' })
  checkRedis() {
    return this.healthService.checkRedis();
  }

  @Get('email')
  @HealthCheck()
  @ApiOperation({ summary: 'Check email service health' })
  checkEmail() {
    return this.healthService.checkEmail();
  }
}
