import { createParamDecorator, SetMetadata, ExecutionContext } from '@nestjs/common';
import { ClaimType } from '@src/security/util/jwt.util';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Claims = createParamDecorator((data: ClaimType, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (data) return request.claims[data];
  return request.claims;
});
