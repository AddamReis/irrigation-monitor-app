import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from './folder-routing.module';

import { MonitorComponent } from './pages/monitor/monitor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule
  ],
  declarations: [
    MonitorComponent
  ]
})
export class FolderPageModule {}
