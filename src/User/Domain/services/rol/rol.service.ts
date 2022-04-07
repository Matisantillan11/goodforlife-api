import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import Rol from './dto';

//services
import { AppService } from 'src/app.service';
import Responseable from 'src/Utils/Ports/Responseable';

@Injectable()
export class RolService {
  constructor(private readonly utilService: AppService) {}

  getAll(model: Model<Document, {}>, aggregations: {}): Promise<Responseable> {
    return this.utilService.getAll(model, aggregations);
  }

  create(model: Model<Document, {}>, data: Rol, idUser: string): Promise<Responseable> {
    return this.utilService.save(data, model, model, idUser);
  }

  update(id: string, data: Rol, model: Model<Document, {}>, userId: string): Promise<Responseable> {
    return this.utilService.update(id, data, model, model, userId);
  }
}
