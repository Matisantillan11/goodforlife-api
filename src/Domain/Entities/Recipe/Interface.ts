import InterfaceUtil from '@Domain/Entities/Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {

	name: string
	title: string
	body: string
	description: string
	picture: string
	poster: string

}
