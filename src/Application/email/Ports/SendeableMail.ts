import Responseable from 'src/Utils/Ports/Responseable';

export default interface SendeableMail {
  sendMail(to: string, text: string, from: string, pass: string, subject: string): Promise<Responseable>;
}
