import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { QueueModule } from './queues/queue.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HttpModule,
    QueueModule,
    MailModule,
  ],
  providers: [],
})
export class AppModule {}
