import { Module } from '@nestjs/common';
import { ConnectionProvider } from 'src/Application/database/connectionProvider.service';
import { Config } from 'src/config';
import { UserService } from './Domain/services/user/user.service';

@Module({
  imports: [ConnectionProvider],
  controllers: Config.controllers.user,
  providers: Config.services.user,
  exports: [UserService],
})
export class UserModule {}
