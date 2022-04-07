import GeteableAll from './GeteableAll';
import Saveable from './Saveable';
import Updateable from './Updateable';

export default interface Controlleable extends GeteableAll, Saveable, Updateable {}
