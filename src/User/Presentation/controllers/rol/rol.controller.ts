import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConnectionProvider } from 'src/Application/database/connectionProvider.service';

import Responseable from 'src/Utils/Ports/Responseable';

import Rol from 'src/User/Domain/services/rol/dto';
import RolSchema from 'src/User/Domain/services/rol/model';
import { RolService } from 'src/User/Domain/services/rol/rol.service';

@Controller('rol')
export class RolController {
  private readonly rolSchema: any;
  private responseService: Responseable;

  constructor(
    @Inject(ConnectionProvider) private readonly connectionProvider: ConnectionProvider,
    private readonly rolService: RolService,
  ) {
    this.rolSchema = new RolSchema();
  }

  @Get('/withoutAuth/:db')
  private async getAllWithoutAuth(@Res() response: Response, @Req() request: Request, @Param('db') db: string) {
    try {
      const model: any = await this.connectionProvider.getModel(db, this.rolSchema.name, this.rolSchema);
      let aggregations: any = request.query.aggregations || {};

      if (request.query) {
        if (request.query.aggregations) {
          try {
            aggregations = JSON.parse(aggregations);
          } catch (error) {
            error = error;
          }
        }
      }

      const RolResponse: Responseable = await this.rolService.getAll(model, aggregations);

      if (Array.isArray(RolResponse.result) && RolResponse.result.length > 0) {
        this.responseService = {
          result: RolResponse.result,
          status: HttpStatus.OK,
          message: RolResponse.message,
          error: '',
        };
      } else {
        this.responseService = {
          result: RolResponse.result,
          status: RolResponse.status || HttpStatus.NOT_FOUND,
          message: RolResponse.message,
          error: RolResponse.error,
        };
      }
    } catch (error) {
      console.log(error);

      this.responseService = {
        result: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '',
        error: error.message,
      };
    }

    if (this.responseService.status) {
      response.status(this.responseService.status).send(this.responseService);
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(this.responseService);
    }
  }

  @Get('/:id')
  getOne(@Param('id') id: string) {
    /* return this.rolService.getOne(name); */
  }

  @Post()
  async createOne(@Body() payload: Rol) {
    const model: any = await this.connectionProvider.getModel('goodforlife', this.rolSchema.name, this.rolSchema);
    return this.rolService.create(model, payload, '61f9d64e2009201a81607470');
  }

  @Delete('/:id')
  async deleteOne(@Res() response: Response, @Req() request: Request, @Param('id') id: string) {
    try {
      const model: any = await this.connectionProvider.getModel('goodforlife', this.rolSchema.name, this.rolSchema);
      let obj: Rol;

      const match = {
        operationType: { $ne: 'D' },
        _id: { $oid: id },
      };

      const aggregations = {
        match,
        limit: 1,
        skip: 0,
      };

      const responseService: Responseable = await this.rolService.getAll(model, aggregations);

      if (Object.keys(responseService.result).length > 0) {
        let obj = responseService.result;
        obj.operationType = 'D';

        const deleteResponse = await this.rolService.update(id, obj, model, '61f9d64e2009201a81607470');

        this.responseService = {
          result: deleteResponse.result,
          message: deleteResponse.message,
          error: deleteResponse.error,
          status: deleteResponse.status,
        };
      } else {
        this.responseService = {
          result: responseService.result,
          message: responseService.message,
          error: responseService.error,
          status: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      console.log(error);

      this.responseService = {
        result: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '',
        error: error.message,
      };
    }

    if (this.responseService.status) {
      response.status(this.responseService.status).send(this.responseService);
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(this.responseService);
    }
  }
}
