import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertConfirmationService {

  constructor(private dialog: MatDialog) { }

  showConfirmation(header: string, message: string, confirmHandler: () => void, cssClass: string = 'custom-dialog') {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '300px',
      panelClass: cssClass, // Aqui você pode passar a classe CSS
      data: { header, message } // Passe os dados para o componente de diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        confirmHandler();
      }
    });
  }
}
