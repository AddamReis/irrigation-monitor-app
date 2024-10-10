import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from './folder-routing.module';

import { MonitorComponent } from './pages/monitor/monitor.component';
import { CardComponent } from '../components/card/card.component';
import { ModalComponent } from '../components/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';

import { NgChartsModule } from 'ng2-charts';
import { AlertConfirmationService } from 'src/services/alert-confirmation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    MatIconModule,
    MatDialogModule,
    NgChartsModule
  ],
  declarations: [
    MonitorComponent,
    CardComponent,
    ModalComponent
  ],
  providers: [
    AlertConfirmationService
  ]
})
export class FolderPageModule {}
