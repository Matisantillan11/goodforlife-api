import TYPES from '@src/TYPES'
import { Container } from "inversify";
import "reflect-metadata";

import Schemable from '@Domain/Entities/Util/Ports/Schemable'
import Validable from '@Domain/Entities/Util/Ports/Validable'
import Routeable from '@Presentation/Controllers/Ports/Routeable'

import CategoryServiceableDomain from '@Domain/Entities/Category/Ports/Serviceable'
import CategoryInterface from '@Domain/Entities/Category/Interface'
import CategoryModel from '@Domain/Entities/Category/Model'
import CategoryServiceDomain from '@Domain/Entities/Category/Controller'
import CategoryDto from '@Domain/Entities/Category/Dto'
import CategoryServicePresentation from '@Presentation/Controllers/Category/Controller'

var container = new Container()
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new CategoryModel).whenTargetNamed(TYPES.Category)
container.bind<Validable>(TYPES.Validable).to(CategoryDto).whenTargetNamed(TYPES.Category)
container.bind<CategoryInterface>(TYPES.CategoryInterface).toConstantValue(new CategoryDto)
container.bind<CategoryServiceableDomain>(TYPES.CategoryServiceableDomain).to(CategoryServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(CategoryServicePresentation)

export default container
