import TYPES from '@src/TYPES'
import { Container } from "inversify";
import "reflect-metadata";

import Schemable from '@Domain/Entities/Util/Ports/Schemable'
import Validable from '@Domain/Entities/Util/Ports/Validable'
import Routeable from '@Presentation/Controllers/Ports/Routeable'

import MenuServiceableDomain from '@Domain/Entities/Menu/Ports/Serviceable'
import MenuInterface from '@Domain/Entities/Menu/Interface'
import MenuModel from '@Domain/Entities/Menu/Model'
import MenuServiceDomain from '@Domain/Entities/Menu/Controller'
import MenuDto from '@Domain/Entities/Menu/Dto'
import MenuServicePresentation from '@Presentation/Controllers/Menu/Controller'

var container = new Container()
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new MenuModel).whenTargetNamed(TYPES.Menu)
container.bind<Validable>(TYPES.Validable).to(MenuDto).whenTargetNamed(TYPES.Menu)
container.bind<MenuInterface>(TYPES.MenuInterface).toConstantValue(new MenuDto)
container.bind<MenuServiceableDomain>(TYPES.MenuServiceableDomain).to(MenuServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(MenuServicePresentation)

export default container
