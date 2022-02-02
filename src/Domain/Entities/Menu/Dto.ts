import { injectable } from 'inversify'
import { Schema } from 'mongoose'

import DtoUtil from '@Domain/Entities/Util/Ports/Dto'
import Interface from './Interface'

@injectable()
export default class EntityDto extends DtoUtil implements Interface {

	public name: string
	public category: Schema.Types.ObjectId
	public description: string
	public price: number
	public picture: string

}
