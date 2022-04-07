import { Model, Document } from 'mongoose';
import { Injectable } from '@nestjs/common';

import Responseable from 'src/Utils/Ports/Responseable';
import User from './dto';

//services
import { AppService } from 'src/app.service';

@Injectable()
export class UserService {
  constructor(private readonly utilService: AppService) {}

  getAll(model: Model<Document, {}>, aggregations: {}): Promise<Responseable> {
    return this.utilService.getAll(model, aggregations);
  }

  create(model: Model<Document, {}>, data: User, idUser: string): Promise<Responseable> {
    return this.utilService.save(data, model, model, idUser);
  }

  update(id: string, data: User, model: Model<Document, {}>, idUser: string): Promise<Responseable> {
    return this.utilService.update(id, data, model, model, idUser);
  }
}
