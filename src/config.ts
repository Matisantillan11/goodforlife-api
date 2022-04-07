import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolService } from './User/Domain/services/rol/rol.service';
import { UserService } from './User/Domain/services/user/user.service';
import { RolController } from './User/Presentation/controllers/rol/rol.controller';
import { UserController } from './User/Presentation/controllers/user/user.controller';

export const Config = {
  enviroment: {
    port: process.env.PORT || 3001,
    company: process.env.DB_NAME,
    front: process.env.FRONT,
    cluster: process.env.NODE_ENV === 'PROD' ? process.env.CLUSTER : process.env.CLUSTER_TEST,
  },
  services: {
    app: [AppService],
    user: [AppService, UserService, RolService],
  },
  controllers: {
    app: [AppController],
    user: [UserController, RolController],
  },
};
