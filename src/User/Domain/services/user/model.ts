import { Schema } from 'mongoose';
import Schemable from '../../../../Utils/model';

export const entity: string = 'user';
export const model = {
  name: {
    type: String,
    typed: 'string',
  },
  rol: {
    ref: 'rol',
    typed: 'id',
    type: Schema.Types.ObjectId,
  },
  phone: {
    type: String,
    typed: 'string',
  },
  email: {
    type: String,
    typed: 'string',
  },
  address: {
    type: String,
    typed: 'string',
  },
  country: {
    type: String,
    typed: 'string',
  },
  password: {
    type: String,
    typed: 'string',
  },

  enabled: {
    type: Boolean,
    typed: 'boolean',
  },

  entity: {
    type: String,
    typed: entity,
  },
};
class ENTITY_SCHEMA extends Schemable {
  public name: string;

  constructor() {
    super(model, {
      collection: entity,
    });
    this.name = entity;
  }
}

export default ENTITY_SCHEMA;
