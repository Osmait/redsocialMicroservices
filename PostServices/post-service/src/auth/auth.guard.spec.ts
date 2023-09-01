import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtService = new JwtService();
    const reflector = new Reflector();
    expect(new AuthGuard(jwtService, reflector)).toBeDefined();
  });
});
