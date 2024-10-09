import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Dados passados para o diálogo
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Fecha o modal
  }

  onActivatePumping(): void {
    this.data.executePumping(this.data.sensorIndex);
    this.dialogRef.close();
  }
}
