import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import DtoUtil from '../../../../Utils/dto';
import Interface from './interface';

export default class Dto extends DtoUtil implements Interface {
  @IsString({ message: 'El nombre del producto debe ser un string' })
  @IsNotEmpty()
  public name: string;

  @IsString({ message: 'La descripción del producto debe ser un string' })
  @IsNotEmpty()
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsNumber()
  @Min(1)
  public stock: number;

  @IsString({ message: 'La url de la imagen debe ser un string' })
  @IsNotEmpty()
  public picture: string;
}
