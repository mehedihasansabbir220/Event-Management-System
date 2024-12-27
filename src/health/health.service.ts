import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult
} from '@nestjs/terminus';
import { CustomHealthIndicator } from './indicators/custom.health';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private customHealth: CustomHealthIndicator
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([
      // System checks
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),   // 150MB
      () => this.disk.checkStorage('disk_health', {
        thresholdPercent: 0.9,
        path: '/'
      }),

      // Service checks
      () => this.db.pingCheck('database'),
      () => this.customHealth.checkRedis(),
      () => this.customHealth.checkEmailService()
    ]);
  }

  async checkDatabase(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database')
    ]);
  }

  async checkRedis(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.customHealth.checkRedis()
    ]);
  }

  async checkEmail(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.customHealth.checkEmailService()
    ]);
  }
}
