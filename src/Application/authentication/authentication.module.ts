import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UserService } from 'src/User/Domain/services/user/user.service';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './Presentation/authentication.controller';
import TokenProvider from './utils/TokenProvider';

@Module({
  providers: [AppService, UserService, TokenProvider, AuthenticationService],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
