import { Schema } from 'mongoose';
import InterfaceUtil from '@Domain/Entities/Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {
	name: string
	category: Schema.Types.ObjectId
	description: string
	price: number
	picture: string

}
