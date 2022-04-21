import UserTokenable from 'src/Application/authentication/Ports/UserTokenable';

import User from 'src/User/Domain/services/user/dto';
import Tokenizable from '../Ports/Tokenizable';

export default class UserToken implements UserTokenable {
  public user: User;
  public token: Tokenizable;
}
