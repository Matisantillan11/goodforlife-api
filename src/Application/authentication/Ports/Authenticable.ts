import { Model, Document } from 'mongoose';

import Responseable from 'src/Utils/Ports/Responseable';
import Registrable from 'src/Utils/Ports/Registrable';
import Logueable from 'src/Utils/Ports/Logueable';

export default interface Authenticable {
  register(userData: Registrable, database: string, model: Model<Document, {}>): Promise<Responseable>;

  login(
    loginData: Logueable,
    database: string,
    model: Model<Document, {}>,
    permissionModel: Model<Document, {}>,
  ): Promise<Responseable>;

  /* loginVerified(
		loginData: LogueableVerified,
		database: string,
		model: Model<Document, {}>
	): Promise<Responseable> */

  /* resetPass(
		user: string,
		userModel: Model<Document, {}>,
		mailModel: Model<Document, {}>,
	): Promise<Responseable> */

  /* getPass(email: string, pass: string, userId: string, userModel: Model<Document, {}>): Promise<Responseable>; */
}
