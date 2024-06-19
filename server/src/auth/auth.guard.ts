import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserAuthRecord } from '.';
import { IS_PUBLIC_KEY } from './public.decorator';
import { REQUIRE_ADMIN_KEY } from './requireAdmin.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const route = `${context.getClass().name}.${context.getHandler().name}`;
    if (isPublic) {
      console.log(`${route} (public)`);
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('Auth Guard: no token in header');
      throw new UnauthorizedException();
    }

    let authUser: UserAuthRecord;

    try {
      const key = this.configService.get('JWT_SECRET');
      const opts = { secret: key };

      authUser = await this.jwtService.verifyAsync(token, opts);

      request['user'] = authUser;
    } catch {
      throw new UnauthorizedException();
    }

    // check if admin is required on the route and present in the user
    const isAdminRequired = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminRequired) {
      console.log(`${route} (auth): ${authUser.username}`);
      return true;
    }

    if (!authUser.isAdmin) {
      console.log(`${authUser.username} is not admin - rejecting`);
      throw new ForbiddenException();
    }

    console.log(`${route} (admin): ${authUser.username}`);

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
