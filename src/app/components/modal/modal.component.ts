import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartDataset } from 'chart.js';
import { Sensor } from 'src/app/folder/pages/monitor/monitor.component';
import { AlertConfirmationService } from 'src/services/alert-confirmation.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  
  public sensorHistoricList: Sensor[] = [];
  public lineChartData: ChartDataset<'line'>[] = [
    { data: [], label: 'Umidade (%)' }
  ];
  public lineChartLabels: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PopupService) private popupService: PopupService,
    private alertConfirmationService: AlertConfirmationService
  ) {}

  ngOnInit(): void {
    this.sensorHistoricList = this.data.sensorHistoricList;
    this.updateChartData(1); // Inicializa com dados do último dia
  }

  onNoClick(): void {
    this.dialogRef.close(); // Fecha o modal
  }

  onActivatePumping(): void {
    this.alertConfirmationService.showConfirmation(
      'Confirmar Ativação',
      'Tem certeza que deseja confirmar a ativação da bomba?',
      () => {
        this.data.executePumping(this.data.sensorIndex);
        this.dialogRef.close();
        this.popupService.showSuccess('Solicitado com sucesso, aguarde a execução', 10);
      },
      'custom-dialog-class'
    );
  }

  setDays(days: number): void {
    this.data.historicOfOndex(this.data.sensorIndex, days).then((sensorHistoricList: Sensor[]) => 
      {
        this.sensorHistoricList = sensorHistoricList;
        this.updateChartData(days);
    });
  }

  private updateChartData(days: number): void {
    // Limpa os dados anteriores do gráfico
    this.lineChartData[0].data = [];
    this.lineChartLabels = [];
  
    const maxPoints = 72;
    const step = Math.ceil(this.sensorHistoricList.length / maxPoints);
  
    this.sensorHistoricList.forEach((sensor, index) => {
      if (index % step === 0) { // Apenas pega pontos em intervalos
        this.lineChartData[0].data.push(sensor.soilMoisturePercentageMean);
        if(days === 1)
          this.lineChartLabels.push(`${sensor.hourMinute}`);
        else
          this.lineChartLabels.push(`(${sensor.day}) ${sensor.hourMinute}`);
      }
    });
  }
}