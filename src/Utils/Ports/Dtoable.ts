import Registrable from './Registrable';
import Identificable from './Identificable';
import Observationable from './Observationable';
import OperationableType from './OperationableType';
import Validable from './Validable';

export default interface Dtoable extends Registrable, Identificable, OperationableType, Observationable, Validable {
  creationUser: string;
  updateUser: string;
  creationDate: string | Date;
  updateDate: string | Date;
}
