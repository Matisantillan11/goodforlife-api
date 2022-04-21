import { HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Responseable from 'src/Utils/Ports/Responseable';
import SendeableMail from './Ports/SendeableMail';
//import SendeableMail from './Ports/SendeableMail';

@Injectable()
export class EmailService implements SendeableMail {
  private responseService: Responseable;

  public async sendMail(to: string, text: string, from: string, pass: string, subject: string): Promise<Responseable> {
    const sendMailResponse = await this.send(from, pass, to, subject, text);
    if (typeof sendMailResponse === 'string' && sendMailResponse !== undefined) {
      const messageResponse = `Se envió un correo a ${to}. Si no lo encuentras, asegurate de revisar tu spam.`;
      return (this.responseService = {
        result: [],
        message: messageResponse,
        error: '',
        status: HttpStatus.OK,
      });
    } else {
      return (this.responseService = {
        result: sendMailResponse,
        message: 'No se pudo enviar el email. Por favor, intentá de nuevo más tarde.',
        error: '',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async send(from: string, pass: string, to: string, subject: string, text: string) {
    return new Promise<Responseable>(async (resolve, reject) => {
      //gmail config
      /* const oAuthGoogle = google.auth.OAuth2
      const oAuthGoogleClient = new oAuthGoogle(
        "25777294883-qv4h6sv4hqhnbln940iibfmdmhit9k71.apps.googleusercontent.com",
        "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",
        "https://developers.google.com/oauthplayground"
      )
      oAuthGoogleClient.setCredentials({
        refresh_token: "1//04Vu7Mmc5uJ60CgYIARAAGAQSNwF-L9IrwnCizkf2bqHmPp-8SjDSRqSX2W1QpRXwZ-kF82uGb2fo2SEIU_1vS9S9nLcdRqm0FH0"
      })
      const accessToken = oAuthGoogleClient.getAccessToken()  */

      //nodemailer config
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: from, pass: pass },
      });

      try {
        transporter.verify(async function (error, success) {
          if (success) {
            await transporter
              .sendMail({
                from: from,
                to: to,
                subject: subject,
                text: text,
                html: text,
              })
              .then((info: any) => {
                if (info !== undefined) {
                  // console.log("Message %s send", info.messageId);
                  resolve(info.messageId);
                }
              })
              .catch((err) => {
                // console.log(err.toString())
                reject(err);
              });
          } else {
            // console.log(error.toString())
            reject(error);
          }
        });
      } catch (err) {
        // console.log(err.toString())
        reject(err);
      }
    });
  }
}
