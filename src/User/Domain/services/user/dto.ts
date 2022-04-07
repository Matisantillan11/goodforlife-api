import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Schema } from 'mongoose';
import Interface from './interface';
import DtoUtil from 'src/Utils/dto';

export default class Dto extends DtoUtil implements Interface {
  @IsString({ message: 'El nombre del usuario debe ser un string' })
  @IsNotEmpty()
  public name: string;

  public rol: Schema.Types.ObjectId;

  @IsString({ message: 'El teléfono debe ser un string' })
  @IsNotEmpty()
  public phone: string;

  @IsEmail({ message: 'El email debe ser válido. example@example.com' })
  @IsNotEmpty()
  public email: string;

  @IsString({ message: 'La dirección debe ser un string' })
  @IsNotEmpty()
  public address: string;

  @IsString({ message: 'El país debe ser un string' })
  @IsNotEmpty()
  public country: string;
}
