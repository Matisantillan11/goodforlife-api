import TYPES from '@src/TYPES'
import { Container } from "inversify";
import "reflect-metadata";

import Schemable from '@Domain/Entities/Util/Ports/Schemable'
import Validable from '@Domain/Entities/Util/Ports/Validable'
import Routeable from '@Presentation/Controllers/Ports/Routeable'

import RecipeServiceableDomain from '@Domain/Entities/Recipe/Ports/Serviceable'
import RecipeInterface from '@Domain/Entities/Recipe/Interface'
import RecipeModel from '@Domain/Entities/Recipe/Model'
import RecipeServiceDomain from '@Domain/Entities/Recipe/Controller'
import RecipeDto from '@Domain/Entities/Recipe/Dto'
import RecipeServicePresentation from '@Presentation/Controllers/Recipe/Controller'

var container = new Container()
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new RecipeModel).whenTargetNamed(TYPES.Recipe)
container.bind<Validable>(TYPES.Validable).to(RecipeDto).whenTargetNamed(TYPES.Recipe)
container.bind<RecipeInterface>(TYPES.RecipeInterface).toConstantValue(new RecipeDto)
container.bind<RecipeServiceableDomain>(TYPES.RecipeServiceableDomain).to(RecipeServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(RecipeServicePresentation)

export default container
