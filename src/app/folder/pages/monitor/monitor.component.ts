import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent  implements OnInit {
  
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  public data: Sensor | null = null;
  
  constructor(
    private firebaseService: FirebaseService,
    private dialog: MatDialog,
  ) 
  {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 3);

    const year = currentDate.toISOString().slice(0, 4).replace('T', ' ');
    const month = currentDate.toISOString().slice(5, 7);
    const day = currentDate.toISOString().slice(8, 10);

    this.firebaseService.getDataRealTime(`period/${year}/${month}/${day}`).subscribe((data) => {
      const timeKeys = Object.keys(data);
      timeKeys.sort((a, b) => { // Comparar as horas e minutos
        const timeA = a.split('-').map(Number);
        const timeB = b.split('-').map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1];
      });
      
      const latestTimeKey = timeKeys[timeKeys.length - 1]; // A última chave é a mais recente
      const latestData = data[latestTimeKey];

      this.data = {
        hourMinute: latestTimeKey.replace('-', ':').toString(),
        soilMoisturePercentageMean: latestData.soilMoisturePercentageMean,
        soilMoistureValueMean: latestData.soilMoistureValueMean,
        soilMoistureSensors: []
      };

      this.processSensorData(latestData);

      console.log('Dados mais recentes:', this.data);
    });
  }

  private processSensorData(latestData: any) {
    let index = 1;

    while (true) {
      const percentage = latestData[`soilMoisturePercentage${index}`];
      const value = latestData[`soilMoistureValue${index}`];

      if (percentage === undefined || value === undefined) {
        break;
      }

      this.addSensorData(percentage, value, index);
      index++;
    }
  }

  private addSensorData(percentage: number | undefined, value: number | undefined, index: number) {
    if (percentage !== undefined && value !== undefined) {
      this.data?.soilMoistureSensors.push({
        index: index,
        soilMoisturePercentage: percentage,
        soilMoistureValue: value,
      });
    }
  }

  private executePumping(index: number, allPumping?: boolean | undefined) {
    if(allPumping) {
      this.firebaseService.updateData('request/', { 'execut-all-pumps': true });
    }
    else if (index > 0) {
      this.firebaseService.updateData('request/', {[`execut-pump-${index}`] : true });
    }
    else{
    }
  }

  async openSensorDetailModal(title: string, percentage: number, value: number, sensorIndex: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      height: '400px',
      data: {
        title: title,
        percentage: percentage,
        value: value,
        sensorIndex: sensorIndex,
        executePumping: (index: number) => this.executePumping(index)
      }
    });
  }
}

export interface SoilMoistureSensor {
  index: number;
  soilMoisturePercentage: number;
  soilMoistureValue: number;
}

export interface Sensor {
  hourMinute: string;
  soilMoisturePercentageMean: number;
  soilMoistureValueMean: number;
  soilMoistureSensors: SoilMoistureSensor[];
}