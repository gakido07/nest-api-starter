import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import AdminModule from './admin/admin.module';
import JwtAuthGuard from './security/auth/guards/jwt.auth.guard';
import UserModule from './user/user.module';
import AuthModule from './security/auth/auth.module';
import SecurityModule from './security/security.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.dbUrl),
    UserModule,
    AdminModule,
    AuthModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware)
      .forRoutes('/')
  }
}
