import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent  implements OnInit {
  
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  
  public data: Sensor | null = null;
  
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 3);

    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    /*this.firebaseService.addData('users/user1', { name: 'Addam Reis', age: 28 })
      .then(() => console.log('Dados adicionados com sucesso'))
      .catch(err => console.error('Erro ao adicionar dados', err));*/

    //const fullDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');

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