import Registrable from '@Domain/Entities/Registrable'
import Identificable from '@Domain/Entities/Identificable'
import Observationable from '@Domain/Entities/Observationable'
import Validable from '@Domain/Entities/Validable'

export default interface Dtoable extends 
	Registrable,
	Identificable,
	Observationable,
	Validable {
	creationDate: string | Date
	updateDate: string | Date

}
