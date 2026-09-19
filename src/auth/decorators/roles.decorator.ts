import { SetMetadata } from '@nestjs/common';
import { Role } from '../../prisma/generated-client/enums.js';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
