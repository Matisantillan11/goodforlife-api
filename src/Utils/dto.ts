import Interface from './Ports/Dtoable';

class DtoUtil implements Interface {
  public _id: string;
  public creationUser: string;
  public updateUser: string;
  public creationDate: Date;
  public operationType: string;
  public updateDate: Date;
  public observation: string;
}

export default DtoUtil;
