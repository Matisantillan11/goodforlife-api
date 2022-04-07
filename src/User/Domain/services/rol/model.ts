import Schemable from '../../../../Utils/model';

export const entity: string = 'rol';
export const model = {
  name: {
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
