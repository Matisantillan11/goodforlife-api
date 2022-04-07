import { IsNotEmpty, IsString } from 'class-validator';
import DtoUtil from '../../../../Utils/dto';
import Interface from './interface';

export default class Dto extends DtoUtil implements Interface {
  @IsString({ message: 'El nombre del rol debe ser un string' })
  @IsNotEmpty()
  public name: string;
}
