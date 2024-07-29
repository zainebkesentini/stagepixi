import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/schemas/user.schema';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Vérifier si la route est publique
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    // Call AuthGuard to ensure user is injected into the request
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      // Unsuccessful authentication
      return false;
    }

    // Successful authentication, user is injected
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    if (!requiredRoles) {
      this.logger.debug('No required roles, allowing access');
      return true;
    }

    if (!user || !user.role) {
      this.logger.error('User or user role is undefined, denying access');
      return false;
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role.includes(role));
    if (hasRequiredRole) {
      this.logger.debug(`User has required role(s): ${JSON.stringify(user.role)}`);
      return true;
    } else {
      this.logger.error(`User does not have required role(s): ${JSON.stringify(user.role)}`);
      return false;
    }
  }
}
