import { HttpStatus, Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';

import CreateableToken from 'src/Application/authentication/Ports/CreateableToken';
//import Logueable from '@Domain/Entities/User/Ports/Logueable'
//import Controlleable from '@Domain/Entities/Util/Ports/Controlleable'
//import SendeableMail from './../UC/Ports/SendeableMail'
import UserTokenable from 'src/Application/authentication/Ports/UserTokenable';
import UserToken from './utils/UserToken';
import Responser from 'src/Application/authentication/utils/Responser';
import Responseable from 'src/Utils/Ports/Responseable';
import { UserService } from 'src/User/Domain/services/user/user.service';
import { AppService } from 'src/app.service';
import TokenProvider from './utils/TokenProvider';
import Authenticable from './Ports/Authenticable';
import Registrable from './Ports/Registrable';
import Logueable from 'src/Utils/Ports/Logueable';

@Injectable()
export class AuthenticationService implements Authenticable {
  //@inject(TYPES.SendeableMail) private sendMailController: SendeableMail
  constructor(
    private readonly AppService: AppService,
    private readonly userService: UserService,
    private readonly tokenProvider: TokenProvider,
  ) {}

  public async register(userData: Registrable, database: string, model: Model<Document, {}>): Promise<Responseable> {
    let responserService: Responseable = new Responser();
    let register: UserTokenable = new UserToken();

    try {
      const existUserEmail = await this.userService.existUserWithThatEmail(userData.email, model);
      if (!existUserEmail) {
        const hashedPassword = await this.userService.hashPassword(userData.password);
        userData.password = hashedPassword;

        const saveResponse = await this.userService.create(model, userData, '');
        if (saveResponse.result) {
          register.user = saveResponse.result;
          register.user.password = undefined;
          register.token = this.tokenProvider.createToken(register.user, database);

          responserService = {
            result: {
              user: register.user,
              token: register.token,
            },
            message: 'Registro exitoso',
            error: '',
            status: HttpStatus.CREATED,
          };
        } else {
          responserService = {
            result: [],
            message: saveResponse.message,
            error: saveResponse.error,
            status: saveResponse.status,
          };
        }
      } else {
        responserService = {
          result: [],
          message: 'El usuario ya se encuentra registrado.',
          error: 'Usuario ya registrado.',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      return responserService;
    } catch (error) {
      return (responserService = {
        result: error.result,
        message: error.message,
        error: error.error,
        status: error.status,
      });
    }
  }

  public async login(
    loginData: Logueable,
    database: string,
    model: Model<Document, {}>,
    permissionModel: Model<Document, {}>,
  ): Promise<Responseable> {
    let responserService: Responseable = new Responser();
    let login: UserTokenable = new UserToken();

    try {
      const existUserEmail = await this.userService.existUserWithThatEmail(loginData.email, model);
      if (existUserEmail) {
        const userResponse = await this.userService.getUserByEmail(loginData.email, model, permissionModel);
        if (userResponse.result) {
          login.user = userResponse.result;

          const matched = await this.userService.isMatch(loginData.password, login.user.password);
          const isEnabled = await this.userService.isEnable(login.user._id, model);

          if (matched) {
            if (isEnabled) {
              login.user.password = undefined;
              login.token = this.tokenProvider.createToken(login.user, database);
              responserService = {
                result: {
                  user: login.user,
                  token: login.token,
                },
                message: 'Bienvenido ' + login.user.email,
                error: '',
                status: HttpStatus.OK,
              };
            } else {
              responserService = {
                result: [],
                message: `El usuario ${loginData.email} no se encuentra habilitado.`,
                error: '',
                status: HttpStatus.NOT_FOUND,
              };
            }
          } else {
            responserService = {
              result: [],
              message: 'No se pudo iniciar sesión. Credenciales inválidas',
              error: '',
              status: HttpStatus.NOT_FOUND,
            };
          }
        }
      } else {
        responserService = {
          result: [],
          message: `El correo ${loginData.email} no se encuetra registrado`,
          error: '',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return responserService;
    } catch (error) {
      console.log(error.message);
      throw new Error(`No se pudo iniciar sesión. Error: ${error.message}`);
    }
  }
}
