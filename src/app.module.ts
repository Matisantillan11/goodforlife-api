import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { Config } from './config';
import { DatabaseModule } from './Application/database/database.module';
import { UserModule } from './User/user.module';
import { ConnectionProvider } from './Application/database/connectionProvider.service';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: Config.controllers.app,
  providers: Config.services.app,
  exports: [AppService],
})
export class AppModule {}
