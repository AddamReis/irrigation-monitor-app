import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartOptions, ChartDataset, ChartType } from 'chart.js';
import { Sensor } from 'src/app/folder/pages/monitor/monitor.component';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.sensorHistoricList = this.data.sensorHistoricList;
    this.updateChartData(1); // Inicializa com dados do último dia
  }

  onNoClick(): void {
    this.dialogRef.close(); // Fecha o modal
  }

  onActivatePumping(): void {
    this.data.executePumping(this.data.sensorIndex); // Ativa a bomba
    this.dialogRef.close();
  }

  setDays(days: number): void {
    this.data.historicOfOndex(this.data.sensorIndex, days).then((sensorHistoricList: Sensor[]) => {
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