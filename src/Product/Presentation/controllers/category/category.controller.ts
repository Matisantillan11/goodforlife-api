import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConnectionProvider } from 'src/Application/database/connectionProvider.service';
import Responseable from 'src/Utils/Ports/Responseable';

import { CategoryService } from '../../../Domain/services/category/category.service';
import CategorySchema from '../../../Domain/services/category/model';
import Category from '../../../Domain/services/category/dto';

@Controller('category')
export class CategoryController {
  private readonly categorySchema: any;
  private responseService: Responseable;

  constructor(
    @Inject(ConnectionProvider) private readonly connectionProvider: ConnectionProvider,
    private readonly categoryService: CategoryService,
  ) {
    this.categorySchema = new CategorySchema();
  }

  @Get('/withoutAuth/:db')
  private async getAllWithoutAuth(@Res() response: Response, @Req() request: Request, @Param('db') db: string) {
    try {
      const model: any = await this.connectionProvider.getModel(db, this.categorySchema.name, this.categorySchema);
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

      const RolResponse: Responseable = await this.categoryService.getAll(model, aggregations);

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
    /* return this.categoryService.getOne(name); */
  }

  @Post()
  async createOne(@Body() payload: Category) {
    const model: any = await this.connectionProvider.getModel(
      'goodforlife',
      this.categorySchema.name,
      this.categorySchema,
    );
    return this.categoryService.create(model, payload, '61f9d64e2009201a81607470');
  }

  @Delete('/:id')
  async deleteOne(@Res() response: Response, @Req() request: Request, @Param('id') id: string) {
    try {
      const model: any = await this.connectionProvider.getModel(
        'goodforlife',
        this.categorySchema.name,
        this.categorySchema,
      );
      let obj: Category;

      const match = {
        operationType: { $ne: 'D' },
        _id: { $oid: id },
      };

      const aggregations = {
        match,
        limit: 1,
        skip: 0,
      };

      const responseService: Responseable = await this.categoryService.getAll(model, aggregations);

      if (Object.keys(responseService.result).length > 0) {
        let obj = responseService.result;
        obj.operationType = 'D';

        const deleteResponse = await this.categoryService.update(id, obj, model, '61f9d64e2009201a81607470');

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
