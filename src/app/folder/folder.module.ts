import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from './folder-routing.module';

import { MonitorComponent } from './pages/monitor/monitor.component';
import { CardComponent } from '../card/card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    MatIconModule
  ],
  declarations: [
    MonitorComponent,
    CardComponent
  ]
})
export class FolderPageModule {}
