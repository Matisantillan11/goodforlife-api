import * as jwt from 'jsonwebtoken';

import { Config } from 'src/config';

import Tokenizable from 'src/Application/authentication/Ports/Tokenizable';
import CreateableToken from 'src/Application/authentication/Ports/CreateableToken';
import Identificable from 'src/Utils/Ports/Identificable';

export default class TokenProvider implements CreateableToken {
  createToken(user: Identificable, database: string): Tokenizable {
    const expiresIn: number = 600 * 600;
    const secret: string = Config.enviroment.tokenSecret;
    const data: {} = { database, _id: user._id };
    const token: Tokenizable = {
      expiresIn,
      token: jwt.sign(data, secret, { expiresIn }),
    };

    return token;
  }
}
