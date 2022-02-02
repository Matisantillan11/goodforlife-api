import { Schema } from 'mongoose'
import { injectable } from 'inversify';

import Schemable from '@Domain/Entities/Util/Model'
import Nameable from '@Domain/Entities/Util/Ports/Nameable'

export const entity: string = 'recipe'

export const model = {
	name: {
		type: String,
		typed: 'string'
	},
	title: {
		type: String,
		typed: 'string'
	},
	body: {
		type: String,
		typed: 'string'
	},
	description: {
		type: String,
		typed: 'string'
	},
	picture: {
		type: String,
		typed: 'string'
	},
	poster: {
		type: String,
		typed: 'string'
	},

	entity: {
		type: String,
		typed: entity
	}

}

@injectable()
export default class ENTITY_SCHEMA extends Schemable implements Nameable {

	public name: string
	'user'
	constructor() {

		super(model, {
			collection: entity
		})

		this.name = entity

	}
}
