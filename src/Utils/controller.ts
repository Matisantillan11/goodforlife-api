import { Model, Document, Types } from 'mongoose';
import * as moment from 'moment';

/* import ConnectionableProvider from './../../../Infrastructure/Persistence/Ports/ConnectionableProvider';
import ConnectionProvider from './../../../Infrastructure/Persistence/ConnectionProvider'; */

import Controlleable from './Ports/Controlleable';
import Dtoable from './Ports/Dtoable';
import Responser from './responser';
import Responseable from './Ports/Responseable';
import Identificable from './Ports/Identificable';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class Controller implements Controlleable {
  public BSON: any = require('bson');
  public EJSON: any;
  private responserService: Responseable;
  /* 	private connectionProvider: ConnectionableProvider */

  constructor() {
    this.EJSON = this.BSON.EJSON;
    this.responserService = new Responser();
    /* 	this.connectionProvider = new ConnectionProvider() */
  }

  public async search(model: Model<Document, {}>, search: string): Promise<Responseable> {
    return new Promise<Responseable>(async (resolve, reject) => {
      if (model !== undefined) {
        await model
          .find({
            $text: {
              $search: search,
            },
          })
          .then((result: any) => {
            let ret: any[] = [];

            result.map((doc: { operationType: string }) => {
              if (doc.operationType !== 'D') ret.push(doc);
            });

            this.responserService = { result: ret, message: 'Consulta exitosa', error: '', status: 200 };
            resolve(this.responserService);
          })
          .catch((err: any) => {
            this.responserService = {
              result: 'Nop',
              message: 'No se pudo realizar la consulta',
              error: err,
              status: 500,
            };
            reject(this.responserService);
          });
      } else {
        this.responserService = {
          result: 'Nop',
          message: 'No se pudo realizar la consulta',
          error: 'Some /entities/util/getAll/return/if(model)',
          status: 500,
        };
        reject(this.responserService);
      }
    });
  }

  public async getAll(model: Model<Document, {}>, aggregations = {}): Promise<Responseable> {
    let queryAggregate: any = [];
    let project = aggregations['project'] || {};
    let match = aggregations['match'] || {};
    let sort = aggregations['sort'] || {};
    let group = aggregations['group'] || {};
    let limit = aggregations['limit'] || 0;
    let skip = aggregations['skip'] || 0;
    let search = aggregations['search'] || '';

    if (Object.entries(search).length > 0) queryAggregate.push({ $search: search });
    if (Object.entries(project).length > 0) {
      this.getLookups(queryAggregate, project, model);

      if (Object.entries(sort).length > 0) queryAggregate.push({ $sort: sort });

      queryAggregate.push({ $project: project });
    } else {
      if (Object.entries(sort).length > 0) queryAggregate.push({ $sort: sort });
    }

    if (Object.entries(match).length > 0) queryAggregate.push({ $match: match });
    if (Object.entries(group).length > 0) queryAggregate.push({ $group: group });

    if (limit > 0) {
      if (Object.entries(group).length > 0) {
        let projectGroup = `{ "items": { "$slice": ["$items", ${skip}, ${limit}] }`;
        for (const prop of group) {
          if (prop !== 'items') {
            projectGroup += `, "${prop}": 1`;
          }
        }
        projectGroup += '}';
        queryAggregate.push({ $project: JSON.parse(projectGroup) });
      } else {
        queryAggregate.push({ $limit: limit });
        queryAggregate.push({ $skip: skip });
      }
    }

    queryAggregate = this.EJSON.parse(JSON.stringify(queryAggregate));

    if (queryAggregate.length === 0) queryAggregate.push({ $limit: 10 });

    if (model !== undefined) {
      try {
        const result = await model.aggregate(queryAggregate);

        if (result.length === 0) {
          if (limit === 1) {
            this.responserService = { result: {}, message: 'Consulta exitosa', error: '', status: 200 };
          } else {
            this.responserService = { result: [], message: 'Consulta exitosa', error: '', status: 200 };
          }
        } else {
          if (limit === 1) {
            this.responserService = { result: result[0], message: 'Consulta exitosa', error: '', status: 200 };
          } else {
            this.responserService = { result: result, message: 'Consulta exitosa', error: '', status: 200 };
          }
        }

        return this.responserService;
      } catch (error) {
        console.log(error.message);
        this.responserService = {
          result: 'Nop',
          message: 'No se pudo realizar la consulta',
          error: error,
          status: 500,
        };
        return this.responserService;
      }
    } else {
      this.responserService = {
        result: 'Nop',
        message: 'No se pudo realizar la consulta',
        error: 'Some /entities/util/getAll/return/if(model)',
        status: 500,
      };
      return this.responserService;
    }
  }

  private getLookups(queryAggregate: any, project: {}, model: any): [] {
    // RELACI??N PRIMER NIVEL

    try {
      let schemaLvl1 = model.schema;
      for (let keyLvl1 of Object.keys(schemaLvl1.paths)) {
        if (schemaLvl1.paths[keyLvl1].instance === 'ObjectID' && schemaLvl1.paths[keyLvl1].options.ref) {
          // BUSCAMOS RELACI??N UNO A UNO
          if (
            this.searchPropertyOfArray(project, `${keyLvl1}.`) ||
            this.searchPropertyOfArray(project, `${keyLvl1}_`)
          ) {
            queryAggregate.push({
              $lookup: {
                from: schemaLvl1.paths[keyLvl1].options.ref,
                foreignField: '_id',
                localField: keyLvl1,
                as: keyLvl1,
              },
            });
            queryAggregate.push({ $unwind: { path: `$${keyLvl1}`, preserveNullAndEmptyArrays: true } });
            // RELACI??N SIGUIENTE NIVEL
            this.getNextLvl(
              queryAggregate,
              project,
              schemaLvl1,
              schemaLvl1.paths[keyLvl1].options.ref,
              keyLvl1,
              keyLvl1,
              model,
            );
          }
        } else if (
          schemaLvl1.paths[keyLvl1].instance === 'Array' &&
          schemaLvl1.paths[keyLvl1].schemaOptions.id &&
          schemaLvl1.paths[keyLvl1].options.type[0].ref
        ) {
          // BUSCAMOS ARRAY DE ID
          if (
            this.searchPropertyOfArray(project, `${keyLvl1}.`) ||
            this.searchPropertyOfArray(project, `${keyLvl1}_`)
          ) {
            queryAggregate.push({
              $lookup: {
                from: schemaLvl1.paths[keyLvl1].options.type[0].ref,
                foreignField: '_id',
                localField: keyLvl1,
                as: keyLvl1,
              },
            });
            // RELACI??N SIGUIENTE NIVEL
            this.getNextLvl(
              queryAggregate,
              project,
              schemaLvl1,
              schemaLvl1.paths[keyLvl1].options.type[0].ref,
              keyLvl1,
              keyLvl1,
              model,
            );
          }
        } else if (schemaLvl1.paths[keyLvl1].instance === 'Array' && !schemaLvl1.paths[keyLvl1].schemaOptions.id) {
          // BUSCAMOS OBJETO DENTRO DEL ARRAY
          for (let attr of Object.keys(schemaLvl1.paths[keyLvl1].options.type[0])) {
            if (schemaLvl1.paths[keyLvl1].options.type[0][attr].ref) {
              if (
                this.searchPropertyOfArray(project, `${keyLvl1}.${attr}.`) ||
                this.searchPropertyOfArray(project, `${keyLvl1}.${attr}_`)
              ) {
                queryAggregate.push({
                  $lookup: {
                    from: schemaLvl1.paths[keyLvl1].options.type[0][attr].ref,
                    foreignField: '_id',
                    localField: `${keyLvl1}.${attr}`,
                    as: `${keyLvl1}.${attr}`,
                  },
                });
                // RELACI??N SIGUIENTE NIVEL
                this.getNextLvl(
                  queryAggregate,
                  project,
                  schemaLvl1,
                  schemaLvl1.paths[keyLvl1].options.type[0][attr].ref,
                  keyLvl1,
                  keyLvl1,
                  model,
                );
              }
            }
          }
        }
      }
      return;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  getNextLvl(
    queryAggregate: any,
    project: {},
    schemaLastLvl: any,
    ref: string,
    lastKey: string,
    keyNew: string,
    model: any,
  ): [] {
    let countRelations: number = 0;
    if (schemaLastLvl.paths[keyNew]) {
      let schemaLvl = model.schema;
      for (let key of Object.keys(schemaLvl.paths)) {
        if (schemaLvl.paths[key].instance === 'ObjectID' && schemaLvl.paths[key].options.ref) {
          if (this.searchPropertyOfArray(project, `${lastKey}.${key}.`)) {
            queryAggregate.push({
              $lookup: {
                from: schemaLvl.paths[key].options.ref,
                foreignField: '_id',
                localField: `${lastKey}.${key}`,
                as: `${lastKey}.${key}`,
              },
            });
            queryAggregate.push({ $unwind: { path: `$${`${lastKey}.${key}`}`, preserveNullAndEmptyArrays: true } });

            // RELACI??N SIGUIENTE NIVEL
            countRelations++;
            this.getNextLvl(
              queryAggregate,
              project,
              schemaLvl,
              schemaLvl.paths[key].options.ref,
              `${lastKey}.${key}`,
              key,
              model,
            );
          }
        } else if (
          schemaLvl.paths[key].instance === 'Array' &&
          schemaLvl.paths[key].schemaOptions.id &&
          schemaLvl.paths[key].options.type[0].ref
        ) {
          // BUSCAMOS ARRAY DE ID
          if (
            this.searchPropertyOfArray(project, `${lastKey}.${key}.`) ||
            this.searchPropertyOfArray(project, `${lastKey}.${key}_`)
          ) {
            queryAggregate.push({
              $lookup: {
                from: schemaLvl.paths[key].options.type[0].ref,
                foreignField: '_id',
                localField: `${lastKey}.${key}`,
                as: `${lastKey}.${key}`,
              },
            });

            // RELACI??N SIGUIENTE NIVEL
            countRelations++;
            this.getNextLvl(
              queryAggregate,
              project,
              schemaLvl,
              schemaLvl.paths[key].options.ref,
              `${lastKey}.${key}`,
              key,
              model,
            );
          }
        } else if (schemaLvl.paths[key].instance === 'Array' && !schemaLvl.paths[key].schemaOptions.id) {
          // BUSCAMOS OBJETO DENTRO DEL ARRAY
          for (let attr of Object.keys(schemaLvl.paths[`${key}`].options.type[0])) {
            if (schemaLvl.paths[`${key}`].options.type[0][attr].ref) {
              if (
                this.searchPropertyOfArray(project, `${lastKey}.${key}.${attr}.`) ||
                this.searchPropertyOfArray(project, `${lastKey}.${key}.${attr}_`)
              ) {
                queryAggregate.push({
                  $lookup: {
                    from: schemaLvl.paths[`${key}`].options.type[0][attr].ref,
                    foreignField: '_id',
                    localField: `${lastKey}.${key}.${attr}`,
                    as: `${lastKey}.${key}.${attr}`,
                  },
                });

                // RELACI??N SIGUIENTE NIVEL
                countRelations++;
                this.getNextLvl(
                  queryAggregate,
                  project,
                  schemaLvl,
                  schemaLvl.paths[key].options.ref,
                  `${lastKey}.${key}`,
                  key,
                  model,
                );
              }
            }
          }
        }
      }
    }
    if (countRelations === 0) {
      return;
    }
  }

  searchPropertyOfArray(json: {}, value: string): boolean {
    let n = false;
    for (const a of Object.keys(json)) {
      if (!n) n = a.includes(value);
    }
    return n;
  }

  public async getById(id: string, model: Model<Document, {}>, userModel: Model<Document, {}>): Promise<Responseable> {
    return new Promise<Responseable>(async (resolve, reject) => {
      if (Types.ObjectId.isValid(id)) {
        await model
          .findById(id)
          .then((res: any) => {
            if (res) {
              this.responserService = {
                result: res,
                message: 'Consulta exitosa',
                error: '',
                status: 200,
              };
              resolve(this.responserService);
            } else {
              this.responserService = {
                result: 'Nop',
                message: 'No se pudo realizar la consulta',
                error: 'No existe res',
                status: 500,
              };
            }
          })
          .catch((err: any) => {
            this.responserService = {
              result: 'Nop',
              message: 'La libreria no pudo buscar el objeto por _id',
              error: err,
              status: 500,
            };
          });
      } else {
        this.responserService = {
          result: 'Nop',
          message: 'El id enviado no es de tipo _id, segun la libreria',
          error: '',
          status: 428,
        };
      }
      reject(this.responserService);
    });
  }

  public async save(
    objData: Dtoable,
    model: Model<Document, {}>,
    userModel: Model<Document, {}>,
    idUser?: string,
  ): Promise<Responseable> {
    return new Promise<Responseable>(async (resolve, reject) => {
      if (Object.keys(objData).length > 0) {
        Object.keys(objData).map((key: string) => {
          if (typeof objData[key] === 'number') {
            objData[key] = this.roundTo(objData[key], 2);
          }
        });
      }

      delete objData._id;

      // console.log('save: ' + model.modelName)
      // console.log(objData)

      //TODO quitar esta dependencia
      objData.creationDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
      objData.operationType = 'C';

      var createdObj: Document;

      try {
        createdObj = new model({ ...objData });
      } catch (err) {
        this.responserService = {
          result: 'Nop',
          message: 'La libreria no pudo crear el nuevo documento',
          error: err,
          status: 500,
        };
        reject(this.responserService);
      }

      await createdObj
        .save()
        .then(async (res: any) => {
          if (res) {
            await this.getById(res._id, model, userModel)
              .then((result: Responseable) => {
                if (result) {
                  let obj: Identificable = result.result;
                  // console.log(obj)
                  this.responserService = {
                    result: obj,
                    message: result.message,
                    error: result.error,
                    status: result.status,
                  };
                  resolve(this.responserService);
                } else {
                  this.responserService = {
                    result: 'Nop',
                    message: 'La capa superior contesto undefined',
                    error: '',
                    status: 500,
                  };
                }
              })
              .catch((err: Responseable) => {
                this.responserService = {
                  result: err.result,
                  message: err.message,
                  error: err.error,
                  status: err.status,
                };
              });
          } else {
            this.responserService = {
              result: 'Nop',
              message: 'La capa superior contesto undefined',
              error: '',
              status: 500,
            };
          }
        })
        .catch((err: any) => {
          console.log(err.message);
          this.responserService = {
            result: 'Nop',
            message: err.message,
            error: err,
            status: 500,
          };
        });
      reject(this.responserService);
    });
  }

  public async update(
    id: string,
    objData: Dtoable,
    model: Model<Document, {}>,
    userModel: Model<Document, {}>,
    idUser: string,
  ): Promise<Responseable> {
    // console.log('update: ' + model.modelName)
    // console.log(objData)

    return new Promise<Responseable>(async (resolve, reject) => {
      objData.updateDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

      await this.getById(id, model, userModel)
        .then((res: Responseable) => {
          if (res && res.result) {
            objData.creationDate = res.result.creationDate;
          } else {
            this.responserService = {
              result: 'Nop',
              message: 'La capa superior contesto undefined, 505',
              error: 'La respuesta no existe',
              status: 500,
            };
          }
        })
        .catch((err: Responseable) => {
          this.responserService = {
            result: err.result,
            message: err.message,
            error: err.error,
            status: err.status,
          };
        });

      await model
        .findByIdAndUpdate(id, objData, { new: true })
        .then(async (doc: any) => {
          if (doc) {
            await this.getById(doc._id, model, userModel)
              .then((res: Responseable) => {
                if (res && res.result) {
                  let obj: Identificable = res.result;
                  // console.log(obj)
                  this.responserService = {
                    result: { _id: obj._id },
                    message: res.message,
                    error: res.error,
                    status: res.status,
                  };
                  resolve(this.responserService);
                } else {
                  this.responserService = {
                    result: 'Nop',
                    message: 'La capa superior contesto undefined, 506',
                    error: 'La respuesta no existe',
                    status: 500,
                  };
                }
              })
              .catch((err: Responseable) => {
                this.responserService = {
                  result: err.result,
                  message: err.message,
                  error: err.error,
                  status: err.status,
                };
              });
          } else {
            this.responserService = {
              result: 'Nop',
              message: 'La libreria no contesto la consulta',
              error: 'La respuesta no existe',
              status: 500,
            };
          }
        })
        .catch((err: any) => {
          if (err.code === 11000) {
            this.responserService = {
              result: 'Nop',
              message: 'La entidad con los parametros solicitados, ya existe',
              status: 428,
              error: err.errmsg,
            };
          } else {
            this.responserService = {
              result: 'Nop',
              message:
                'La libreria no pudo realizar la busqueda y modificacion. Fijate que te olvidaste de pedir el id de uno de los atributos en el typehead, que a su vez, son otra entidad. Otra causa puede ser que quisiste realizar un registro que tiene una relacion, pero el registro no existe. Esto es porque no elegiste nada del dropdown.',
              error: err,
              status: 500,
            };
          }
        });
      reject(this.responserService);
    });
  }

  private roundTo(value: number, places: number) {
    var power = Math.pow(10, places);
    return Math.round(value * power) / power;
  }
}
