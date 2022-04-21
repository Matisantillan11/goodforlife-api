import User from 'src/User/Domain/services/user/dto';
import Tokenizable from './Tokenizable';

export default interface UserTokenable {
  user: User;
  token: Tokenizable;
}
