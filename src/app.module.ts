import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import AdminModule from './admin/admin.module';
import JwtAuthGuard from './security/auth/guards/jwt.auth.guard';
import UserModule from './user/user.module';
import AuthModule from './security/auth/auth.module';
import SecurityModule from './security/security.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.dbUrl),
    UserModule,
    AdminModule,
    AuthModule,
    SecurityModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ],
})
export class AppModule {}
