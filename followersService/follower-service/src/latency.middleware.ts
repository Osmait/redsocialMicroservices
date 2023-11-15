import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Summary } from 'prom-client';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('register_latency') public counter: Summary<string>,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const end = this.counter.startTimer();
    next();
    this.counter
      .labels({ method: req.method, path: req.path.split('/')[1] })
      .observe(end());
  }
}
