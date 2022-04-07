import InterfaceUtil from '../../../../Utils/interface';

export default interface Rol extends InterfaceUtil {
  name: string;
  description: string;
  price: number;
  stock: number;
  picture: string;
}
