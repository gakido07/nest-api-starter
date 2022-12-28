import { Request } from 'express';
import { AppUserDocument, Claims } from 'src/security/util/jwt.util';

export type CustomRequestContext = Request & { claims: Claims<AppUserDocument> };