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
  public sensorHistoricList: Sensor[] = [];
  
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
      //console.log('Dados mais recentes:', this.data);
    });
  }

  private historicOfOndex(index: number, days: number = 1): Promise<any[]> {
    return new Promise((resolve) => {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 3);
        this.sensorHistoricList = [];
        
        const fetchDataForDay = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            this.firebaseService.getDataRealTime(`period/${year}/${month}/${day}`).subscribe((data) => {
                Object.keys(data).forEach((time) => {
                    const soilMoisturePercentage = data[time][`soilMoisturePercentage${index}`];
                    const soilMoistureValue = data[time][`soilMoistureValue${index}`];
        
                    if (soilMoisturePercentage !== undefined && soilMoistureValue !== undefined) {
                        this.sensorHistoricList.push({
                            day: date.getDate(),
                            hourMinute: time.replace('-', ':'),
                            soilMoisturePercentageMean: soilMoisturePercentage,
                            soilMoistureValueMean: soilMoistureValue,
                            soilMoistureSensors: []
                        });
                    }
                });

                if (date.getDate() === currentDate.getDate() - (days - 1)) {
                  this.sensorHistoricList.sort((a, b) => {
                      if (a.day !== b.day) {
                        return a.day! - b.day!;
                      }
                      const [hourA, minuteA] = a.hourMinute.split(':').map(Number);
                      const [hourB, minuteB] = b.hourMinute.split(':').map(Number);
                      if (hourA === hourB) {
                        return minuteA - minuteB;
                      } else {
                        return hourA - hourB;
                      }
                  });
              
                  resolve(this.sensorHistoricList);
              }
            });
        };

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(currentDate.getDate() - i);
            fetchDataForDay(date);
        }
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
    
    this.historicOfOndex(sensorIndex, 1);

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '780px',
      height: '600px',
      maxWidth: '95vw',
      maxHeight: '95vw',
      data: {
        title: title,
        percentage: percentage,
        value: value,
        sensorIndex: sensorIndex,
        sensorHistoricList: this.sensorHistoricList,
        executePumping: (index: number) => this.executePumping(index),
        historicOfOndex: (index: number, days: number) => this.historicOfOndex(index, days)
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
  day?: number | null;
  hourMinute: string;
  soilMoisturePercentageMean: number;
  soilMoistureValueMean: number;
  soilMoistureSensors: SoilMoistureSensor[];
}