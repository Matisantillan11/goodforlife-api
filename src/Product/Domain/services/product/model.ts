import { Schema } from 'mongoose';
import Schemable from '../../../../Utils/model';

export const entity: string = 'product';
export const model = {
  name: {
    type: String,
    typed: 'string',
  },
  category: {
    ref: 'category',
    typed: 'id',
    type: Schema.Types.ObjectId,
  },
  description: {
    type: String,
    typed: 'string',
  },
  price: {
    type: Number,
    typed: 'number',
  },
  stock: {
    type: Number,
    typed: 'number',
  },
  picture: {
    type: String,
    typed: 'string',
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
