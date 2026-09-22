import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // 1. Obtener el contexto HTTP y la petición (request)
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 2. Si se pasó un argumento al decorador, devolver solo esa propiedad
    return data ? user?.[data] : user;
  },
);
