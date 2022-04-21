import { Schema } from 'mongoose';
import InterfaceUtil from '../../../../Utils/interface';

export default interface User extends InterfaceUtil {
  enabled: boolean;
  name: string;
  rol: Schema.Types.ObjectId;
  phone: string;
  email: string;
  address: string;
  country: string;
  password: string;
}
