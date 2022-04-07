import Registrable from './Ports/Registrable';
import Identificable from './Ports/Identificable';
import Observationable from './Ports/Observationable';
import Validable from './Ports/Validable';

export default interface Dtoable extends Registrable, Identificable, Observationable, Validable {
  creationDate: string | Date;
  updateDate: string | Date;
}
