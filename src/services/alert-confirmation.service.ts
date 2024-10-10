import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertConfirmationService {

  constructor(private alertController: AlertController) { }

  async showConfirmation(
    header: string, 
    message: string, 
    confirmHandler: () => void, 
    cssClass: string = 'custom-alert'
  ) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      cssClass: cssClass,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            confirmHandler();
          }
        }
      ]
    });

    await alert.present();
  }
}
