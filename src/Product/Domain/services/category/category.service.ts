import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';

import { AppService } from 'src/app.service';
import Responseable from 'src/Utils/Ports/Responseable';

import Category from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly utilService: AppService) {}

  getAll(model: Model<Document, {}>, aggregations: {}): Promise<Responseable> {
    return this.utilService.getAll(model, aggregations);
  }

  create(model: Model<Document, {}>, data: Category, idUser: string): Promise<Responseable> {
    return this.utilService.save(data, model, model, idUser);
  }

  update(id: string, data: Category, model: Model<Document, {}>, userId: string): Promise<Responseable> {
    return this.utilService.update(id, data, model, model, userId);
  }
}
